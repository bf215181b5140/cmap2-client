import { mainWindow } from '../electron/electron';

export class SocketConnection {
    type: SocketConnectionType = SocketConnectionType.MESSAGE;
    message: string = 'Not connected';
    description: string = '';

    public setConnection(type: SocketConnectionType, message: string, description?: string) {
        this.type = type;
        this.message = message;
        if (description) this.description = description;
    }
}

export enum SocketConnectionType {
    MESSAGE,
    SUCCESS,
    ERROR,
}
