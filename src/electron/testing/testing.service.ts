import {ClientSocketService} from "../webSocket/clientSocketService";
import {Message} from "node-osc";

export function testing() {
    setInterval(() => {
        const parameters: string[] = ['Skin', 'Outfit', 'Socks'];
        const parameter: string | undefined = parameters.at(Math.floor(Math.random() * 3));
        const value: number = Math.floor(Math.random() * 10);
        console.log('Sending test parameter to server: ', parameter, value);
        ClientSocketService.emitParameter('parameter', new Message(parameter!, value))
    }, 20000);
}