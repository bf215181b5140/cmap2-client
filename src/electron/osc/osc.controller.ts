import { OscService } from './osc.service';
import TypedIpcMain from '../ipc/typedIpcMain';
import { BridgeService } from '../bridge/bridge.service';
import { VrcParameter } from 'cmap2-shared';
import { GeneralSettings } from '../../shared/types/settings';
import { Message } from 'node-osc';

export class OscController extends OscService {
    private trackedParameters: Map<string, boolean | number | string> = new Map();
    private isActive: boolean = false;
    private lastActivity: number = 0;

    /**
     * Sets listeners for events and starts OSC server and client
     */
    constructor(settings: GeneralSettings) {
        super(settings);

        TypedIpcMain.on('setGeneralSettings', (settings) => {
            if (!this.oscSettings) {
                this.start(settings);
            } else if (this.oscSettings.oscIp !== settings.oscIp ||
                this.oscSettings.oscInPort !== settings.oscInPort ||
                this.oscSettings.oscOutPort !== settings.oscOutPort) {
                this.start(settings);
            }
        });
        TypedIpcMain.handle('getLastOscActivity', async () => this.lastActivity);
        TypedIpcMain.handle('getTrackedParameters', async () => this.trackedParameters);
        TypedIpcMain.on('setTrackedParameters', parameters => this.trackedParameters = parameters);
        TypedIpcMain.on('setTrackedParameter', parameter => this.trackedParameters.set(parameter.path, parameter.value));
        TypedIpcMain.on('deleteTrackedParameter', parameter => this.trackedParameters.delete(parameter.path));

        BridgeService.on('sendOscMessage', (message: Message) => this.send(message));

        // Currently nothing subscribes to this
        // BridgeService.on('getOscActivity', () => BridgeService.emit('oscActivity', this.isActive));
    }

    /**
     * Gets called every time a new osc message is received.<br>
     * Used to track any osc activity.
     * @protected
     */
    protected activity() {
        this.lastActivity = Date.now();
        if (!this.isActive) {
            this.isActive = true;

            // Currently nothing subscribes to this
            // BridgeService.emit('oscActivity', this.isActive);
        }
    }

    /**
     * Gets called every time a new valid parameter is received.<br>
     * Spam parameters have already been filtered.
     * @param vrcParameter
     * @protected
     */
    protected received(vrcParameter: VrcParameter) {
        this.trackedParameters.set(vrcParameter.path, vrcParameter.value);
        BridgeService.emit('vrcParameter', vrcParameter);
        TypedIpcMain.emit('vrcParameter', vrcParameter);
    }
}
