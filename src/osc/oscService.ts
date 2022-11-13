import {ArgumentType, Client, Message, Server} from 'node-osc';
import {ClientSocketService} from "../webSocket/clientSocketService";

export class OscService {

    static oscServer = new Server(9001, '127.0.0.1');
    static oscClient = new Client('127.0.0.1', 9000);

    static init() {
        this.oscServer.on('message', function (message: [string, ...ArgumentType[]]) {
            console.log('New message, length: ', message.length, ': ', message);
            message.forEach(x => ClientSocketService.emit('parameter', x));
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