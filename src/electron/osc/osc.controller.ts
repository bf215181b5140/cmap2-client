import { IPC } from '../ipc/typedIpc.service';
import { BRIDGE } from '../bridge/bridge.service';
import { TrackedParametersMap, VrcParameter } from 'cmap2-shared';
import { ArgumentType, Client, Message, Server } from 'node-osc';
import { OscSettings } from '../../shared/objects/settings';
import { SETTINGS } from '../store/settings/settings.store';

const ignoredOscParameters = ['/avatar/parameters/VelocityZ', '/avatar/parameters/VelocityY', '/avatar/parameters/VelocityX',
                              '/avatar/parameters/InStation', '/avatar/parameters/Seated', '/avatar/parameters/Upright',
                              '/avatar/parameters/AngularY', '/avatar/parameters/Grounded', '/avatar/parameters/Face',
                              '/avatar/parameters/GestureRightWeight', '/avatar/parameters/GestureRight',
                              '/avatar/parameters/GestureLeftWeight', '/avatar/parameters/GestureLeft', '/avatar/parameters/Voice',
                              '/avatar/parameters/Viseme', '/avatar/parameters/VelocityMagnitude'];

export class OscController {
    private oscServer: Server | undefined;
    private oscClient: Client | undefined;
    private oscSettings: OscSettings | undefined;

    private ignoredParameters: Set<string> = new Set(ignoredOscParameters);
    private trackedParameters = new TrackedParametersMap();
    private trackedParametersActivity: Map<string, number> = new Map();

    private lastActivity: number | undefined;
    private clearOnAvatarChange: boolean;

    constructor() {

        IPC.on('saveOscSettings', settings => {
            if (!this.oscSettings) {
                this.start(settings);
            } else if (this.oscSettings.ip !== settings.ip ||
                this.oscSettings.inPort !== settings.inPort ||
                this.oscSettings.outPort !== settings.outPort) {
                this.start(settings);
            }
        });

        IPC.on('saveTrackedParametersSettings', data => this.clearOnAvatarChange = data.clearOnAvatarChange);

        IPC.handle('getLastOscActivity', async () => this.lastActivity);
        IPC.handle('getTrackedParameters', async () => this.trackedParameters);
        // IPC.on('setTrackedParameters', parameters => this.trackedParameters = parameters);
        IPC.on('setTrackedParameter', parameter => this.trackedParameters.set(parameter.path, parameter.value));
        IPC.on('deleteTrackedParameter', path => this.trackedParameters.delete(path));

        BRIDGE.on('sendOscMessage', message => this.send(message));
        IPC.on('sendVrcParameter', data => this.send(new Message(data.path, data.value)));

        // Currently nothing subscribes to this
        // BridgeService.on('getOscActivity', () => BridgeService.emit('oscActivity', this.isActive));

        this.clearOnAvatarChange = SETTINGS.get('trackedParameters').clearOnAvatarChange;

        this.start(SETTINGS.get('osc'));
    }

    private start(settings: OscSettings) {
        if (this.oscServer) this.oscServer.close();
        if (this.oscClient) this.oscClient.close();

        this.oscSettings = { ...settings };

        this.oscClient = new Client(settings.ip, settings.inPort);
        this.oscServer = new Server(settings.outPort, settings.ip);

        this.oscServer.on('message', message => this.onOscMessage(message));
    }

    private onOscMessage(message: [string, ...ArgumentType[]]) {
        // track last message activity
        this.lastActivity = Date.now();

        const path = message[0];

        // filter ignored parameters
        if (this.ignoredParameters.has(path)) return;

        const value = this.valueFromArgumentType(message[1]);

        const vrcParameter: VrcParameter = { path, value };

        this.trackedParameters.set(vrcParameter.path, vrcParameter.value);
        if (this.clearOnAvatarChange) this.trackedParametersActivity.set(vrcParameter.path, Date.now());

        BRIDGE.emit('vrcParameter', vrcParameter);
        IPC.emit('vrcParameter', vrcParameter);

        if (this.clearOnAvatarChange && vrcParameter.path.startsWith('/avatar/change')) this.clearParametersAfterAvatarChange();
    }

    private clearParametersAfterAvatarChange() {
        // first wait 300ms so all avatar change parameters get here
        setTimeout(() => {
            // set cutoutTime to 600ms ago
            const cutoutTime = Date.now() - 600;

            // filter parameters from activity map, that are older than cutoutTime
            const deleteParameters: string[] = [];
            this.trackedParametersActivity.forEach((time, path) => time < cutoutTime && deleteParameters.push(path));

            // delete tracked parameters
            deleteParameters.forEach(param => {
                this.trackedParameters.delete(param);
                this.trackedParametersActivity.delete(param);
            });

            // emit new tracked parameters
            const trackedparametersDto = this.trackedParameters.dto();
            BRIDGE.emit('trackedParameters', trackedparametersDto);
            IPC.emit('trackedParameters', trackedparametersDto);
        }, 300);
    }

    private send(message: Message) {
        if (this.oscClient) this.oscClient.send(message);
    }

    private valueFromArgumentType(arg: ArgumentType): boolean | number | string {
        if (typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string') {
            return arg;
        } else {
            return arg.value;
        }
    }
}
