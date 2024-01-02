import { ipcMain, IpcMainEvent } from 'electron';
import { mainWindow } from '../electron';
import { DeviceInformation, QRCodeData, ToyCommand } from 'lovense';
import { VrcParameter } from 'cmap2-shared';
import { LovenseSettings, LovenseStatus, ToyActionType, ToyCommandParameter } from '../../shared/lovense';
import { BridgeService } from '../bridge/bridge.service';
import LovenseService from './lovense.service';
import { StoreService } from '../store/store.service';
import TypedIpcMain from '../ipc/typedIpcMain';

// '/avatar/parameters/LovenseContact',
//                                     '/avatar/parameters/OGB/Pen/Penis/TouchOthers',
//                                     '/avatar/parameters/OGB/Pen/Penis/TouchSelf',
//                                     '/avatar/parameters/OGB/Pen/Penis/PenSelf',
//                                     '/avatar/parameters/OGB/Pen/Penis/PenOthers',
//                                     '/avatar/parameters/OGB/Pen/Penis/FrotOthers'

export default class LovenseController extends LovenseService {
    private lovenseSettings: LovenseSettings = StoreService.getLovenseSettings();
    private lovenseStatus: LovenseStatus = new LovenseStatus();
    private toyCommandParameters: Map<string, ToyCommandParameter> = new Map<string, ToyCommandParameter>();
    private toyCommandHistory: Map<string, number> = new Map<string, number>();

    constructor() {
        super();

        this.setToyCommandParameters(StoreService.getToyCommandParameters());

        TypedIpcMain.on('setLovenseSettings', (lovenseSettings: LovenseSettings) => this.lovenseSettings = lovenseSettings);
        TypedIpcMain.on('getLovenseStatus', () => this.updateLovenseStatus());
        TypedIpcMain.on('sendLovenseToyCommand', (toyCommand: ToyCommand) => this.sendToyCommand(toyCommand));
        TypedIpcMain.on('lovenseConnect', () => this.connect());
        TypedIpcMain.on('lovenseDisconnect', () => this.disconnect());
        TypedIpcMain.on('setToyCommandParameters', (toyCommandParameters: ToyCommandParameter[]) => this.setToyCommandParameters(toyCommandParameters));

        BridgeService.on('vrcParameter', (vrcParameter: VrcParameter) => this.checkOscParameters(vrcParameter));
    }

    private setToyCommandParameters(toyCommandParameters: ToyCommandParameter[]): void {
        this.toyCommandParameters = new Map<string, ToyCommandParameter>(toyCommandParameters.map(toyCommandParameters => {
            return [toyCommandParameters.parameterPath, toyCommandParameters];
        }));
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

    private checkOscParameters(vrcParameter: VrcParameter) {
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
            BridgeService.emit('toyCommand', toyCommand);

            // if this isn't a stop command and command time isn't infinite
            if (toyCommand.action !== ToyActionType.Stop || toyCommand.timeSec !== 0) this.createToyCommandCallback(toyCommand);
        }
    }

    private createToyCommandCallback(toyCommand: ToyCommand) {
        // save toy command unix time
        this.toyCommandHistory.set(toyCommand.toy ?? '', Date.now());
        // create callback with timeout (with extra 50ms leeway)
        setTimeout((toyCommand: ToyCommand) => {
            // if last saved command for this toy is older than how long the command lasted
            if ((this.toyCommandHistory.get(toyCommand.toy ?? '') ?? 0) + (toyCommand.timeSec * 1000) < Date.now()) {
                // emmit a false stop command
                BridgeService.emit('toyCommand', {...toyCommand, action: 'Stop'});
            }
        }, (toyCommand.timeSec * 1000) + 50, toyCommand);
    }

    private updateLovenseStatus() {
        this.lovenseStatus.socketConnection = this.isSocketConnected();

        // todo this is ugly, fix
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('lovenseStatus', this.lovenseStatus);
        }

        if (this.lovenseSettings.sendConnectionOscMessage) {
            const vrcParameter: VrcParameter = {
                path: this.lovenseSettings.connectionOscMessagePath,
                value: this.lovenseStatus.status === 1
            }
            BridgeService.emit('sendOscMessage', vrcParameter);
        }
    }

    protected disconnect() {
        super.disconnect();
        this.lovenseStatus = new LovenseStatus();
        this.updateLovenseStatus();
    }
}
