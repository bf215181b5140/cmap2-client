import { ArgumentType, Client, Message, Server } from 'node-osc';
import { ClientSocketService } from '../webSocket/clientSocket.service';
import { ClientStoreService } from '../util/clientStore.service';
import { OscSettings } from '../../shared/classes';

export class OscService {

    static oscServer: Server;
    static oscClient: Client;
    static ignoredParams: Set<string> = new Set(['VelocityZ', 'VelocityY', 'VelocityX', 'InStation', 'Seated', 'Upright', 'AngularY', 'Grounded',
                                                 'GestureRightWeight', 'GestureRight', 'GestureLeftWeight', 'GestureLeft', 'Voice', 'Viseme']);

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
            const parameter = message[0].slice(message[0].lastIndexOf('/') + 1);
            if (!this.ignoredParams.has(parameter)) {
                if (message[0].indexOf('/avatar/change') !== -1) {
                    ClientSocketService.sendParameter('avatar', new Message(parameter, message[1]));
                } else {
                    ClientSocketService.sendParameter('parameter', new Message(parameter, message[1]));
                }
            }
        });
    }

    static send(message: Message) {
        console.log('Sending OSC message to VRChat:', message);
        if (this.oscClient) this.oscClient.send(message);
    }
}
