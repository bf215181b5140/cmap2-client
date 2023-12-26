import { Argument, ArgumentType, Client, Message, MessageLike, Server } from 'node-osc';
import { ClientSocketService } from '../webSocket/clientSocket.service';
import { ClientStoreService } from '../util/clientStore.service';
import { OscSettings } from '../../shared/classes';
import { VrcParameter } from 'cmap2-shared';
import { mainWindow } from '../electron';
import { LovenseController } from '../lovense/lovense.controller';

export class OscController {

    static oscServer: Server;
    static oscClient: Client;

    static activityInterval: NodeJS.Timer;
    static lastActivity: number = 0;
    static isActive: boolean = false;
    static activityIntervalMs: number = 60000;

    static forwardOscToRenderer: boolean = false;

    static ignoredParams: Set<string> = new Set(['/avatar/parameters/VelocityZ', '/avatar/parameters/VelocityY', '/avatar/parameters/VelocityX',
                                                 '/avatar/parameters/InStation', '/avatar/parameters/Seated', '/avatar/parameters/Upright',
                                                 '/avatar/parameters/AngularY', '/avatar/parameters/Grounded', '/avatar/parameters/Face',
                                                 '/avatar/parameters/GestureRightWeight', '/avatar/parameters/GestureRight',
                                                 '/avatar/parameters/GestureLeftWeight', '/avatar/parameters/GestureLeft', '/avatar/parameters/Voice',
                                                 '/avatar/parameters/Viseme', '/avatar/parameters/VelocityMagnitude']);

    static start() {

        if (this.oscServer) this.oscServer.close();
        if (this.oscClient) this.oscClient.close();

        const storeSettings = ClientStoreService.getApplicationSettings();
        const oscSettings = new OscSettings();

        if (storeSettings) {
            if (storeSettings.oscIp) oscSettings.oscIp = storeSettings.oscIp;
            if (storeSettings.oscInPort) oscSettings.oscInPort = storeSettings.oscInPort;
            if (storeSettings.oscOutPort) oscSettings.oscOutPort = storeSettings.oscOutPort;
        }

        this.oscClient = new Client(oscSettings.oscIp!, oscSettings.oscInPort!);
        this.oscServer = new Server(oscSettings.oscOutPort!, oscSettings.oscIp!);

        if (!this.activityInterval) this.activityInterval = setInterval(this.activityChecker, 60000);

        this.oscServer.on('message', (message: [string, ...ArgumentType[]]) => {

            // set activity
            this.lastActivity = Date.now();
            if (!this.isActive) {
                this.isActive = true;
                ClientSocketService.sendData('activity', true);
            }

            // filter parameters
            if (!this.ignoredParams.has(message[0])) {

                const path = message[0];
                const value = this.valueFromArgumentType(message[1]);

                const vrcParameter: VrcParameter = {path, value};

                if (path.indexOf('/avatar/change') !== -1) {
                    ClientSocketService.sendParameter('avatar', {path: vrcParameter.path, value: vrcParameter.value});
                } else {
                    ClientSocketService.sendParameter('parameter', vrcParameter);
                    LovenseController.checkParameter(vrcParameter);
                    if (this.forwardOscToRenderer && mainWindow && !mainWindow.isDestroyed()) {
                        mainWindow.webContents.send('vrcParameter', vrcParameter);
                    }

                }
            }
        });
    }

    static send(message: VrcParameter) {
        if (this.oscClient) {
            console.log('Sending OSC message to VRChat:', message);
            this.oscClient.send(new Message(message.path, message.value));
        }
    }

    static activityChecker = () => {
        if (this.oscClient) {
            this.oscClient.send(new Message('/avatar/parameters/VRMode', 10));
        }
        const recentActivity = this.lastActivity > (Date.now() - ((this.activityIntervalMs * 3) + 2000));
        if (recentActivity !== this.isActive) {
            this.isActive = recentActivity;
            ClientSocketService.sendData('activity', this.isActive);
        }
    };

    static valueFromArgumentType(arg: ArgumentType): boolean | number | string {
        if (typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string') {
            return arg;
        } else {
            return arg.value
        }
    }
}
