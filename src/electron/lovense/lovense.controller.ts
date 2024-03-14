import { DeviceInformation, QRCodeData, ToyCommand } from 'lovense';
import { ValueType, VrcParameter } from 'cmap2-shared';
import { LovenseSettings, LovenseStatus, ToyActionType, ToyCommandOscMessage, ToyCommandParameter } from '../../shared/lovense';
import { BridgeService } from '../bridge/bridge.service';
import LovenseService from './lovense.service';
import { StoreService } from '../store/store.service';
import TypedIpcMain from '../ipc/typedIpcMain';
import { Message } from 'node-osc';

// '/avatar/parameters/LovenseContact',
//                                     '/avatar/parameters/OGB/Pen/Penis/TouchOthers',
//                                     '/avatar/parameters/OGB/Pen/Penis/TouchSelf',
//                                     '/avatar/parameters/OGB/Pen/Penis/PenSelf',
//                                     '/avatar/parameters/OGB/Pen/Penis/PenOthers',
//                                     '/avatar/parameters/OGB/Pen/Penis/FrotOthers'

export default class LovenseController extends LovenseService {
    private lovenseSettings: LovenseSettings;
    private lovenseStatus: LovenseStatus = new LovenseStatus();
    private toyCommandParameters: Map<string, ToyCommandParameter> = new Map<string, ToyCommandParameter>();
    private toyCommandHistory: Map<string, number> = new Map<string, number>();
    private toyCommandOscMessages: Map<string, ToyCommandOscMessage[]> = new Map<string, ToyCommandOscMessage[]>();

    constructor() {
        super();

        this.lovenseSettings = StoreService.getLovenseSettings();
        this.setToyCommandParameters(StoreService.getToyCommandParameters());
        this.setToyCommandOscMessages(StoreService.getToyCommandOscMessages());

        TypedIpcMain.on('setLovenseSettings', (lovenseSettings: LovenseSettings) => this.lovenseSettings = lovenseSettings);
        TypedIpcMain.on('getLovenseStatus', () => TypedIpcMain.emit('lovenseStatus', this.lovenseStatus));
        TypedIpcMain.on('sendLovenseToyCommand', (toyCommand: ToyCommand) => this.sendToyCommand(toyCommand));
        TypedIpcMain.on('lovenseConnect', () => this.connect());
        TypedIpcMain.on('lovenseDisconnect', () => this.disconnect());
        TypedIpcMain.on('setToyCommandParameters', (toyCommandParameters: ToyCommandParameter[]) => this.setToyCommandParameters(toyCommandParameters));
        TypedIpcMain.on('setToyCommandOscMessages', (toyCommandOscMessages: ToyCommandOscMessage[]) => this.setToyCommandOscMessages(toyCommandOscMessages));

        BridgeService.on('vrcParameter', (vrcParameter: VrcParameter) => this.checkOscParametersForToyCommand(vrcParameter));
    }

    protected setQrCodeData(data: QRCodeData): void {
        this.lovenseStatus.qrCodeData = data;
        this.updateLovenseStatus();
    };

    protected setConnectionStatus(status: number): void {
        this.lovenseStatus.status = status;
        this.updateLovenseStatus();
    };

    protected setDeviceInformation(deviceInformation: DeviceInformation): void {
        this.lovenseStatus.deviceInformation = deviceInformation;
        this.updateLovenseStatus();
    };

    /**
     * Fires every time an update regarding lovense connection is received.<br>
     * Emits lovenseStatus for renderer and sends osc message to Vrchat
     * @private
     */
    private updateLovenseStatus() {
        this.lovenseStatus.socketConnection = this.isSocketConnected();

        TypedIpcMain.emit('lovenseStatus', this.lovenseStatus);

        if (this.lovenseSettings.sendConnectionOscMessage) {
            const vrcParameter: VrcParameter = {
                path: this.lovenseSettings.connectionOscMessagePath,
                value: this.lovenseStatus.status === 1
            };
            BridgeService.emit('sendOscMessage', new Message(vrcParameter.path, vrcParameter.value));
        }
    }

    /**
     * Disconnects from Lovense
     * @protected
     */
    protected disconnect() {
        super.disconnect();
        this.lovenseStatus = new LovenseStatus();
        this.updateLovenseStatus();
    }

    /**
     * Creates a map of Vrchat parameters for which toy commands should be sent
     * @param toyCommandParameters
     * @private
     */
    private setToyCommandParameters(toyCommandParameters: ToyCommandParameter[]): void {
        this.toyCommandParameters = new Map<string, ToyCommandParameter>(toyCommandParameters.map(toyCommandParameters => {
            return [toyCommandParameters.parameterPath, toyCommandParameters];
        }));
    }

    /**
     * If osc parameter is in the map, send toy command that corresponds to it
     * @param vrcParameter
     * @private
     */
    private checkOscParametersForToyCommand(vrcParameter: VrcParameter) {
        if (!this.canSendToyCommand()) return;

        const toyCommandParameter: ToyCommandParameter | undefined = this.toyCommandParameters.get(vrcParameter.path);
        if (toyCommandParameter) {

            let actionMaxValue: number = 20;
            if (toyCommandParameter.action === ToyActionType.Pump || toyCommandParameter.action === ToyActionType.Depth) actionMaxValue = 3;

            let actionValue: number = 0;
            if (typeof vrcParameter.value === 'number') {
                if (vrcParameter.value > 1) {
                    // integer
                    actionValue = Math.min(vrcParameter.value, actionMaxValue);
                } else {
                    // float (unless 1)
                    actionValue = Math.ceil(vrcParameter.value * actionMaxValue);
                }
            }
            if (typeof vrcParameter.value === 'boolean') actionValue = vrcParameter.value ? actionMaxValue : 0;

            let action: string = `${toyCommandParameter.action}:${actionValue}`;
            if (toyCommandParameter.action === ToyActionType.Stop) action = ToyActionType.Stop;

            const toyCommand: ToyCommand = {
                command: 'Function',
                action: action,
                timeSec: toyCommandParameter.timeSec,
                toy: toyCommandParameter.toy,
                apiVer: 1
            };

            this.sendToyCommand(toyCommand);
            this.checkToyCommandForOscMessage(toyCommand);

            // if this isn't a stop command and command time isn't infinite
            if (toyCommand.action !== ToyActionType.Stop || toyCommand.timeSec !== 0) this.createToyCommandStopCallback(toyCommand);
        }
    }

    /**
     * If ToyCommand duration isn't infinite,
     * then create a timeout to send another OSC message after timeSec (ToyCommand time length) and mimic a ToyCommand for stopping.<br>
     * Unless a new command was issued since the last one.
     * @param toyCommand
     * @private
     */
    private createToyCommandStopCallback(toyCommand: ToyCommand) {
        // save toy command unix time
        this.toyCommandHistory.set(toyCommand.toy ?? '', Date.now());
        // create callback with timeout (with extra 50ms leeway)
        setTimeout((toyCommand: ToyCommand) => {
            // if last saved command for this toy is older than how long the command lasted
            if ((this.toyCommandHistory.get(toyCommand.toy ?? '') ?? 0) + (toyCommand.timeSec * 1000) < Date.now()) {
                // emmit a false stop command
                this.checkToyCommandForOscMessage({...toyCommand, action: ToyActionType.Stop});
            }
        }, (toyCommand.timeSec * 1000) + 50, toyCommand);
    }

    /**
     * Creates a map of toy commands for which Osc messages should be sent
     * @param toyCommandOscMessages
     * @private
     */
    private setToyCommandOscMessages(toyCommandOscMessages: ToyCommandOscMessage[]): void {
        this.toyCommandOscMessages = new Map<string, ToyCommandOscMessage[]>();
        toyCommandOscMessages.forEach(toyCommandOscMessage => {
            if (this.toyCommandOscMessages.has(toyCommandOscMessage.toy)) {
                this.toyCommandOscMessages.get(toyCommandOscMessage.toy)?.push(toyCommandOscMessage);
            } else {
                this.toyCommandOscMessages.set(toyCommandOscMessage.toy, [toyCommandOscMessage]);
            }
        });
    }

    /**
     * If toy command is in the map, send OSC message that describes toy command/activity
     * @param toyCommand
     * @private
     */
    private checkToyCommandForOscMessage(toyCommand: ToyCommand) {
        const toyCommandOscMessages = this.toyCommandOscMessages.get(toyCommand.toy ?? '');
        toyCommandOscMessages?.forEach(toyCommandOscMessage => {

            const actionValue = Number.parseInt(toyCommand.action.split(':').at(1) ?? '0');

            let value: number | boolean;
            switch (toyCommandOscMessage.valueType) {
                case ValueType.Int:
                    value = actionValue;
                    break;
                case ValueType.Float:
                    const action = toyCommand.action.split(':').at(0);
                    switch (action) {
                        case ToyActionType.Stop:
                            value = 0;
                            break;
                        case ToyActionType.Pump:
                        case ToyActionType.Depth:
                            value = actionValue / 3;
                            break;
                        default:
                            value = actionValue / 20;
                            break;
                    }
                    break;
                case ValueType.Bool:
                default:
                    value = actionValue !== 0;
                    break;
            }
            BridgeService.emit('sendOscMessage', new Message(toyCommandOscMessage.parameterPath, value));
        });
    }
}
