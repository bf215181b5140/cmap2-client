import { ArgumentType, Client, Message, Server } from 'node-osc';
import { ClientSocketService } from '../webSocket/clientSocket.service';

export class OscService {

    static ignoredParams: Set<string> = new Set(['VelocityZ', 'VelocityY', 'VelocityX', 'InStation', 'Seated', 'Upright', 'AngularY', 'Grounded',
                                                 'GestureRightWeight', 'GestureRight', 'GestureLeftWeight', 'GestureLeft', 'Voice', 'Viseme']);

    static oscServer = new Server(9001, '127.0.0.1');
    static oscClient = new Client('127.0.0.1', 9000);

    static init() {
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
        this.oscClient.send(message);
    }
}
