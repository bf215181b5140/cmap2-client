import { io, Socket } from 'socket.io-client';
import { OscService } from '../osc/osc.service';
import { mainWindow, serverUrl } from '../electron';
import { Message } from 'node-osc';
import { ClientStoreService } from '../util/clientStore.service';
import { ConnectionStatus, ConnectionStatusCode } from '../../shared/ConnectionStatus';
import { OscMessage } from 'cmap2-shared/common.interfaces';

export class ClientSocketService {

    static socket: Socket;
    static connectionStatus: ConnectionStatus = new ConnectionStatus(ConnectionStatusCode.DISCONNECTED);

    // Connect to web server
    static connect() {

        // Get client credentials for authentication
        const clientCredentials = ClientStoreService.getClientCredentials();
        if (clientCredentials) {

            if (this.socket) this.socket.close();
            this.socket = io(serverUrl + '/clientSocket', {
                query: {
                    username: clientCredentials.username,
                    password: clientCredentials.password
                }
            });

            this.connectionStatus.setStatus(ConnectionStatusCode.CONNECTING);

            this.socket.on('connect', () => {
                this.connectionStatus.setStatus(ConnectionStatusCode.AUTHENTICATING);
                mainWindow.webContents.send('updateConnectionStatus', this.connectionStatus);
            });

            this.socket.on('authenticationFailed', () => {
                this.connectionStatus.setStatus(ConnectionStatusCode.AUTHENTICATION_FAILED);
                mainWindow.webContents.send('updateConnectionStatus', this.connectionStatus);
            });

            this.socket.on('authenticated', () => {
                this.connectionStatus.setStatus(ConnectionStatusCode.CONNECTED);
                mainWindow.webContents.send('updateConnectionStatus', this.connectionStatus);
            });

            this.socket.on('disconnect', () => {
                this.connectionStatus.setStatus(ConnectionStatusCode.DISCONNECTED);
                mainWindow.webContents.send('updateConnectionStatus', this.connectionStatus);
            });

            this.socket.on('parameter', (parameter: OscMessage) => {
                OscService.send(new Message('/avatar/parameters/' + parameter.address, parameter.args.at(0)!));
            });

        } else {
            if (this.socket) this.socket.close();
            this.connectionStatus.setStatus(ConnectionStatusCode.NO_CREDENTIALS);
            mainWindow.webContents.send('updateConnectionStatus', this.connectionStatus);
        }
    }

    static sendParameter(event: string, parameter: Message) {
        if (this.socket) {
            this.socket.emit(event, parameter);
        }
    }
}
