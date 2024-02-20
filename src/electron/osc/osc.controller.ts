import { OscService } from './osc.service';
import TypedIpcMain from '../ipc/typedIpcMain';
import { BridgeService } from '../bridge/bridge.service';
import { VrcParameter } from 'cmap2-shared';
import { Settings } from '../../shared/types/settings';

export class OscController extends OscService {
    private isActive: boolean = false;
    private lastActivity: number = 0;
    private activityInterval: NodeJS.Timer | undefined;
    private activityIntervalMs: number = 60000;

    private forwardOscToRenderer: boolean = false;

    /**
     * Sets listeners for events and starts OSC server and client
     */
    constructor(settings: Settings) {
        super(settings);

        TypedIpcMain.on('setSettings', (settings) => {
            if (!this.oscSettings) {
                this.start(settings);
            } else if (this.oscSettings.oscIp !== settings.oscIp ||
                this.oscSettings.oscInPort !== settings.oscInPort ||
                this.oscSettings.oscOutPort !== settings.oscOutPort) {
                this.start(settings);
            }
        });
        TypedIpcMain.on('forwardOscToRenderer', (forward: boolean) => this.forwardOscToRenderer = forward);
        TypedIpcMain.handle('getLastOscActivity', async () => this.lastActivity);

        BridgeService.on('sendOscMessage', (vrcParameter: VrcParameter) => this.send(vrcParameter));
        BridgeService.on('getOscActivity', () => BridgeService.emit('oscActivity', this.isActive));

        if (!this.activityInterval) this.activityInterval = setInterval(() => this.activityChecker(), this.activityIntervalMs);
    }

    /**
     * Gets called every time a new osc message is recieved.<br>
     * Used to track any osc activity.
     * @protected
     */
    protected activity() {
        this.lastActivity = Date.now();
        if (!this.isActive) {
            this.isActive = true;
            BridgeService.emit('oscActivity', this.isActive);
        }
    }

    /**
     * Gets called every time a new valid parameter is recieved.<br>
     * Spam parameters have already been filtered.
     * @param vrcParameter
     * @protected
     */
    protected recieved(vrcParameter: VrcParameter) {
        if (vrcParameter.path.indexOf('/avatar/change') !== -1) {
            BridgeService.emit('vrcAvatar', vrcParameter);
        } else {
            BridgeService.emit('vrcParameter', vrcParameter);
            if (this.forwardOscToRenderer) {
                TypedIpcMain.emit('vrcParameter', vrcParameter);
            }
        }
    }

    /**
     * Periodically sends OSC message to VRChat (every this.activityIntervalMs).<br>
     * Checks if last activity was more than 3x this.activityIntervalMs ago.<br>
     * Emits on activity change.
     */
    private activityChecker() {
        this.send({path: '/avatar/parameters/VRMode', value: 10});
        const recentActivity = this.lastActivity > (Date.now() - ((this.activityIntervalMs * 3) + 2000));
        if (recentActivity !== this.isActive) {
            this.isActive = recentActivity;
            BridgeService.emit('oscActivity', this.isActive);
        }
    };
}
