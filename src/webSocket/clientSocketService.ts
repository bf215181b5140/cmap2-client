import {io, Socket} from "socket.io-client";
import {OscService} from "../osc/oscService";
import {clientStore, serverUrl} from "../electron";
import {Message} from "node-osc";

export class ClientSocketService {

    static socket: Socket;

    static init() {
        if(clientStore.get('apiKey')) {
            this.socket = io(serverUrl + '/clientSocket', {query: {clientApiKey: clientStore.get('apiKey')}});

            console.log('Opened IO socket with clientApiKey: ', clientStore.get('apiKey'))

            this.socket.on('parameter', (param: Message) => {
                OscService.send(param);
            });
        }
    }

    static emitParameter(event: string, parameter: Message) {
        if(this.socket) {
            this.socket.emit(event, parameter);
        }
    }
}