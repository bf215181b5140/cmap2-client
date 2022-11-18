import {ArgumentType, Client, Message, Server } from 'node-osc';
import {ClientSocketService} from "../webSocket/clientSocketService";

export class OscService {

    static ignoredParams: Set<string> = new Set(['VelocityZ', 'VelocityY', 'VelocityX', 'InStation', 'Seated', 'Upright', 'AngularY', 'Grounded', 'GestureRightWeight', 'GestureRight', 'GestureLeftWeight', 'GestureLeft', 'Voice', 'Viseme']);

    static oscServer = new Server(9001, '127.0.0.1');
    static oscClient = new Client('127.0.0.1', 9000);

    static init() {
        this.oscServer.on('message', (message: [string, ...ArgumentType[]]) => {
            console.log('New message, length: ', message.length, ': ', message);
            const parameter = message[0].slice(message[0].lastIndexOf('/')+1);
            if(!this.ignoredParams.has(parameter)) {
                ClientSocketService.emitParameter('parameter', new Message(parameter, message[1]))
            }
        });

        setInterval(() => {
            console.log('Sending test OSC message: /avatar/parameters/Skin 5');
            this.oscClient.send(new Message('/avatar/parameters/Skin', 5));
        }, 30000);
    }

    static send(message: Message) {
        console.log('Sending OSC message:', message);
        this.oscClient.send(message);

    }
}