import { ArgumentType, Client, Message, MessageLike, Server } from 'node-osc';
import { ClientSocketService } from '../webSocket/clientSocket.service';
import { ClientStoreService } from '../util/clientStore.service';
import { OscSettings } from '../../shared/classes';
import { OscMessage } from 'cmap2-shared';
import { mainWindow } from '../electron';

export class OscService {

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
            this.lastActivity = Date.now();
            if (!this.isActive) {
                this.isActive = true;
                ClientSocketService.sendData('activity', true);
            }
            if (!this.ignoredParams.has(message[0])) {
                if (message[0].indexOf('/avatar/change') !== -1) {
                    ClientSocketService.sendParameter('avatar', new Message(message[0].slice(message[0].lastIndexOf('/') + 1), message[1]));
                } else {
                    ClientSocketService.sendParameter('parameter', new Message(message[0], message[1]));
                    if (this.forwardOscToRenderer && mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('oscMessage', {
                        address: message[0],
                        args: [message[1]]
                    } as OscMessage);

                }
            }
        });
    }

    static send(message: OscMessage) {
        if (this.oscClient) {
            console.log('Sending OSC message to VRChat:', message);
            this.oscClient.send(new Message(message.address, ...message.args));
        }
    }

    static activityChecker = () => {
        if (this.oscClient) {
            this.oscClient.send(new Message('/avatar/parameters/VRMode', ...[10]));
        }
        const recentActivity = this.lastActivity > (Date.now() - ((this.activityIntervalMs * 3) + 2000));
        if (recentActivity !== this.isActive) {
            this.isActive = recentActivity;
            ClientSocketService.sendData('activity', this.isActive);
        }
    }
}
