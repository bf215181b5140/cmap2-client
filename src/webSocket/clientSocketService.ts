import {io, Socket} from "socket.io-client";
import {OscService} from "../osc/oscService";
import {serverUrl} from "../electron";
import {Message} from "node-osc";
import {ClientStoreService} from "../util/clientStoreService";
import {OscMessage} from "../global";

export class ClientSocketService {

    static socket: Socket;

    static connect() {
        const clientCredentials = ClientStoreService.getClientCredentials();
        if(clientCredentials) {
            if(this.socket) this.socket.close()
            this.socket = io(serverUrl + '/clientSocket', {query: {username: clientCredentials.username, apiKey: clientCredentials.apiKey}});

            console.log('Opened IO socket with: ', ClientStoreService.getClientCredentials())

            this.socket.on('connect', () => console.log('Server confirmed socket connection'));

            this.socket.on('disconnect', () => console.log('Server closed socket connection'));

            this.socket.on('authenticated', () => console.log('Server authenticated socket connection'));

            this.socket.on('parameter', (parameter: OscMessage) => {
                console.log('test message ', new Message('/avatar/parameters/Skin', 5));
                console.log('my message ', new Message('/avatar/parameters/' + parameter.address, parameter.args.at(0)!));
                console.log('parameter.args.at(0) ', typeof parameter.args.at(0));
                OscService.send(new Message('/avatar/parameters/' + parameter.address, parameter.args.at(0)!));
            });
        }
    }

    static emitParameter(event: string, parameter: Message) {
        if(this.socket) {
            this.socket.emit(event, parameter);
        }
    }
}