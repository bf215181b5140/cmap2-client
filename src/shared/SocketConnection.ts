import { mainWindow } from '../electron/electron';

export class SocketConnection {
    type: SocketConnectionType = SocketConnectionType.MESSAGE;
    message: string = 'Not connected';
    description: string = '';

    constructor() {
        mainWindow.webContents.send('updateConnectionStatus', this);
    }

    public setConnection(type: SocketConnectionType, message: string, description?: string) {
        this.type = type;
        this.message = message;
        if (description) this.description = description;
        mainWindow.webContents.send('updateConnectionStatus', this);
    }
}

export enum SocketConnectionType {
    MESSAGE,
    SUCCESS,
    ERROR,
}
