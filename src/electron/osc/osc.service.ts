import { ArgumentType, Client, Message, Server } from 'node-osc';
import { StoreService } from '../store/store.service';
import { ValueType, VrcParameter } from 'cmap2-shared';
import { mainWindow } from '../electron';
import { BridgeService } from '../bridge/bridge.service';
import { ToyCommand } from 'lovense';
import { ToyActionType, ToyCommandOscMessage } from '../../shared/lovense';
import TypedIpcMain from '../ipc/typedIpcMain';
import { OscSettings } from '../../shared/types/osc';
import { Settings } from '../../shared/types/settings';

export class OscService {
    private oscServer: Server | undefined;
    private oscClient: Client | undefined;
    private oscSettings: OscSettings | undefined;

    private activityInterval: NodeJS.Timer | undefined;
    private lastActivity: number = 0;
    private isActive: boolean = false;
    private activityIntervalMs: number = 60000;

    private forwardOscToRenderer: boolean = false;

    private ignoredParams: Set<string> = new Set(['/avatar/parameters/VelocityZ', '/avatar/parameters/VelocityY', '/avatar/parameters/VelocityX',
                                                  '/avatar/parameters/InStation', '/avatar/parameters/Seated', '/avatar/parameters/Upright',
                                                  '/avatar/parameters/AngularY', '/avatar/parameters/Grounded', '/avatar/parameters/Face',
                                                  '/avatar/parameters/GestureRightWeight', '/avatar/parameters/GestureRight',
                                                  '/avatar/parameters/GestureLeftWeight', '/avatar/parameters/GestureLeft', '/avatar/parameters/Voice',
                                                  '/avatar/parameters/Viseme', '/avatar/parameters/VelocityMagnitude']);

    private toyCommandOscMessages: Map<string, ToyCommandOscMessage[]> = new Map<string, ToyCommandOscMessage[]>();

    /**
     * Sets listeners for events and starts OSC server and client
     */
    constructor() {
        TypedIpcMain.on('setSettings', (settings) => {
            if (!this.oscSettings) {
                this.start(settings);
            } else if (this.oscSettings.oscIp !== settings.oscIp ||
                this.oscSettings.oscInPort !== settings.oscInPort ||
                this.oscSettings.oscOutPort !== settings.oscOutPort) {
                this.start(settings);
            }
        });
        TypedIpcMain.on('setToyCommandOscMessages', (toyCommandOscMessages: ToyCommandOscMessage[]) => this.setToyCommandOscMessages(toyCommandOscMessages));
        TypedIpcMain.on('forwardOscToRenderer', (forward: boolean) => this.forwardOscToRenderer = forward);

        BridgeService.on('toyCommand', (toyCommand: ToyCommand) => this.checkToyCommand(toyCommand));
        BridgeService.on('sendOscMessage', (vrcParameter: VrcParameter) => this.send(vrcParameter));
        BridgeService.on('getOscActivity', () => BridgeService.emit('oscActivity', this.isActive));


        this.setToyCommandOscMessages(StoreService.getToyCommandOscMessages());
        this.start(StoreService.getSettings());
    }

    /**
     * Starts or restarts OSC server and client along with handling new OSC messages
     * @param settings
     * @private
     */
    private start(settings: Settings) {
        if (this.oscServer) this.oscServer.close();
        if (this.oscClient) this.oscClient.close();

        this.oscClient = new Client(settings.oscIp, settings.oscInPort);
        this.oscServer = new Server(settings.oscOutPort, settings.oscIp);

        if (!this.activityInterval) this.activityInterval = setInterval(() => this.activityChecker(), this.activityIntervalMs);

        this.oscServer.on('message', (message: [string, ...ArgumentType[]]) => {
            // set activity
            this.lastActivity = Date.now();
            if (!this.isActive) {
                this.isActive = true;
                BridgeService.emit('oscActivity', this.isActive);
            }

            // filter parameters
            if (!this.ignoredParams.has(message[0])) {

                const path = message[0];
                const value = this.valueFromArgumentType(message[1]);

                const vrcParameter: VrcParameter = {path, value};

                if (vrcParameter.path.indexOf('/avatar/change') !== -1) {
                    BridgeService.emit('vrcAvatar', vrcParameter);
                } else {
                    BridgeService.emit('vrcParameter', vrcParameter);
                    if (this.forwardOscToRenderer && mainWindow && !mainWindow.isDestroyed()) {
                        mainWindow.webContents.send('vrcParameter', vrcParameter);
                    }
                }
            }
        });
    }

    /**
     * Creates a map of toy commands instead of using arrays
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
    private checkToyCommand(toyCommand: ToyCommand) {
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
            this.send({path: toyCommandOscMessage.parameterPath, value: value});
        });
    }

    /**
     * Sends new OSC message to VRChat
     * @param message
     * @private
     */
    private send(message: VrcParameter) {
        if (this.oscClient) {
            this.oscClient.send(new Message(message.path, message.value));
        }
    }

    /**
     * Periodically sends OSC message to VRChat (every this.activityIntervalMs).<br>
     * Checks if last activity was more than 3x this.activityIntervalMs ago.<br>
     * Emits on activity change.
     */
    private activityChecker() {
        if (this.oscClient) {
            this.oscClient.send(new Message('/avatar/parameters/VRMode', 10));
        }
        const recentActivity = this.lastActivity > (Date.now() - ((this.activityIntervalMs * 3) + 2000));
        if (recentActivity !== this.isActive) {
            this.isActive = recentActivity;
            BridgeService.emit('oscActivity', this.isActive);
        }
    };

    /**
     * Gets value from OSC message argument
     * @param arg
     * @private
     */
    private valueFromArgumentType(arg: ArgumentType): boolean | number | string {
        if (typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string') {
            return arg;
        } else {
            return arg.value;
        }
    }
}
