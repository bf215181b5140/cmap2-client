import io from 'socket.io-client';
import { OscController } from '../osc/osc.controller';
import { Message } from 'node-osc';
import { SocketConnection, SocketConnectionType } from '../../shared/SocketConnection';
import { VrcParameter } from 'cmap2-shared';
import { ClientCredentials } from '../../shared/classes';
import { ClientStoreService } from '../util/clientStore.service';
import { mainWindow } from '../electron';
import { URL } from '../../shared/const';

export class ClientSocketService {

    static socket: SocketIOClient.Socket;
    static connectionStatus: SocketConnection = new SocketConnection();

    static connect() {
        const clientCredentials = ClientStoreService.getClientCredentials();
        if (!clientCredentials) return;

        if (this.socket) this.socket.close();
        this.socket = io(URL + '/clientSocket', {
            query: {
                username: clientCredentials.username,
                password: clientCredentials.password
            },
            transports: ["websocket"]
        });

        this.connectionStatus.setConnection(SocketConnectionType.MESSAGE, 'Connecting...', '');
        this.updateConnectionStatus()

        this.socket.on('joined', () => {
            this.connectionStatus.setConnection(SocketConnectionType.SUCCESS, 'Connected', '');
            this.updateConnectionStatus()
            this.sendData('activity', OscController.isActive);
        });

        this.socket.on('error', (message: string) => {
            this.connectionStatus.setConnection(SocketConnectionType.ERROR, 'Error', message);
            this.updateConnectionStatus()
        });

        this.socket.on('connect_error', (err: Error) => {
            this.connectionStatus.setConnection(SocketConnectionType.ERROR, 'Error', err.message);
            this.updateConnectionStatus()
        });

        this.socket.on('disconnect', () => {
            this.connectionStatus.setConnection(SocketConnectionType.ERROR, 'Disconnected');
            this.updateConnectionStatus()
        });

        this.socket.on('parameter', (parameter: VrcParameter) => {
            OscController.send(parameter);
        });
    }

    static disconnect() {
        if (this.socket) this.socket.close();
        this.connectionStatus.setConnection(SocketConnectionType.MESSAGE, 'Not connected', '');
        this.updateConnectionStatus()
    }

    static sendParameter(event: string, parameter: VrcParameter) {
        if (this.socket) {
            this.socket.emit(event, parameter);
        }
    }

    static sendData(event: string, data: any) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    static updateConnectionStatus() {
        if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('updateConnectionStatus', this.connectionStatus);
    }
}
