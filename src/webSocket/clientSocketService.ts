import {io, Socket} from "socket.io-client";
import {OscService} from "../osc/oscService";
import {ArgumentType, Message} from "node-osc";
import {FileSystemService} from "../fileSystem/fileSystemService";
import {serverUrl} from "../electron";

export class ClientSocketService {

    static socket: Socket;

    static init() {
        if(FileSystemService.apiKey) {
            this.socket = io(serverUrl + '/clientSocket', {query: {clientApiKey: FileSystemService.apiKey}});
            console.log('Opened IO socket with clientApiKey: ', FileSystemService.apiKey)
            this.socket.on('parameter', (param: { parameter: string, value: ArgumentType }) => {
                OscService.send(new Message(param.parameter, param.value));
            });
        }
    }

    static emit(event: string, data:any) {
        if(this.socket) {
            this.socket.emit(event, data);
        }
    }
}