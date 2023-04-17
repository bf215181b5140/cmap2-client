import { ArgumentType, Client, Message, MessageLike, Server } from 'node-osc';
import { ClientSocketService } from '../webSocket/clientSocket.service';
import { ClientStoreService } from '../util/clientStore.service';
import { OscSettings } from '../../shared/classes';
import { OscMessage } from 'cmap2-shared';

export class OscService {

    static oscServer: Server;
    static oscClient: Client;
    static ignoredParams: Set<string> = new Set(['/avatar/parameters/VelocityZ', '/avatar/parameters/VelocityY', '/avatar/parameters/VelocityX',
                                                 '/avatar/parameters/InStation', '/avatar/parameters/Seated', '/avatar/parameters/Upright',
                                                 '/avatar/parameters/AngularY', '/avatar/parameters/Grounded',
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

        this.oscServer.on('message', (message: [string, ...ArgumentType[]]) => {
            console.log('Received OSC message from VRChat: ', message);
            if (!this.ignoredParams.has(message[0])) {
                if (message[0].indexOf('/avatar/change') !== -1) {
                    ClientSocketService.sendParameter('avatar', new Message(message[0].slice(message[0].lastIndexOf('/') + 1), message[1]));
                } else {
                    ClientSocketService.sendParameter('parameter', new Message(message[0], message[1]));
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
}
