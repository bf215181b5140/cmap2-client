import { io, Socket } from 'socket.io-client';
import { OscService } from '../osc/osc.service';
import { mainWindow } from '../electron';
import { Message } from 'node-osc';
import { ClientStoreService } from '../util/clientStore.service';
import { SocketConnectionStatus, SocketConnectionStatusCode } from '../../shared/SocketConnectionStatus';
import { OscMessage } from 'cmap2-shared';

export class ClientSocketService {

    static socket: Socket;
    static connectionStatus: SocketConnectionStatus = new SocketConnectionStatus(SocketConnectionStatusCode.DISCONNECTED);

    static connect() {
        const clientCredentials = ClientStoreService.getClientCredentials();
        if (clientCredentials) {

            if (this.socket) this.socket.close();
            this.socket = io(clientCredentials.serverUrl + '/clientSocket', {
                query: {
                    username: clientCredentials.username,
                    password: clientCredentials.password
                }
            });

            this.connectionStatus.setStatus(SocketConnectionStatusCode.CONNECTING);

            this.socket.on('connect', () => {
                this.connectionStatus.setStatus(SocketConnectionStatusCode.AUTHENTICATING);
                mainWindow.webContents.send('updateConnectionStatus', this.connectionStatus);
            });

            this.socket.on('authenticationFailed', () => {
                this.connectionStatus.setStatus(SocketConnectionStatusCode.AUTHENTICATION_FAILED);
                mainWindow.webContents.send('updateConnectionStatus', this.connectionStatus);
            });

            this.socket.on('authenticated', () => {
                this.connectionStatus.setStatus(SocketConnectionStatusCode.CONNECTED);
                mainWindow.webContents.send('updateConnectionStatus', this.connectionStatus);
            });

            this.socket.on('disconnect', () => {
                this.connectionStatus.setStatus(SocketConnectionStatusCode.DISCONNECTED);
                mainWindow.webContents.send('updateConnectionStatus', this.connectionStatus);
            });

            this.socket.on('parameter', (parameter: OscMessage) => {
                OscService.send(new Message('/avatar/parameters/' + parameter.address, parameter.args.at(0)!));
            });

        } else {
            if (this.socket) this.socket.close();
            this.connectionStatus.setStatus(SocketConnectionStatusCode.NO_CREDENTIALS);
            mainWindow.webContents.send('updateConnectionStatus', this.connectionStatus);
        }
    }

    static sendParameter(event: string, parameter: Message) {
        if (this.socket) {
            this.socket.emit(event, parameter);
        }
    }
}
