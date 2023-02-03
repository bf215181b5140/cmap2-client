import { io, Socket } from 'socket.io-client';
import { OscService } from '../osc/osc.service';
import { mainWindow, serverUrl } from '../electron';
import { Message } from 'node-osc';
import { ClientStoreService } from '../util/clientStore.service';
import { OscMessage, SocketConnectionStatus } from '../../shared/global';
import { SocketConnectionState } from '../../shared/enums';

export class ClientSocketService {

    static socket: Socket;
    static connectionStatus: SocketConnectionStatus = {
        state: SocketConnectionState.DISCONNECTED,
        message: 'Not connected',
        description: 'Failed to start connection'
    };

    // Connect to web server
    static connect() {

        // Get client credentials for authentication
        const clientCredentials = ClientStoreService.getClientCredentials();
        if (clientCredentials) {

            if (this.socket) this.socket.close();
            this.socket = io(serverUrl + '/clientSocket', {
                query: {
                    username: clientCredentials.username,
                    apiKey: clientCredentials.apiKey
                }
            });

            this.connectionStatus = {
                state: SocketConnectionState.CONNECTING,
                message: 'Connecting',
                description: 'Trying to connect with server...'
            };

            this.socket.on('connect', () => {
                this.connectionStatus = {
                    state: SocketConnectionState.CONNECTING,
                    message: 'Connecting',
                    description: 'Waiting for server authentication.'
                };
                mainWindow.webContents.send('updateConnectionStatus', this.connectionStatus);
            });

            this.socket.on('authenticationFailed', () => {
                this.connectionStatus = {
                    state: SocketConnectionState.AUTHENTICATION_FAILED,
                    message: 'Authentication failed',
                    description: 'Your login information is wrong for the specified server.'
                };
                mainWindow.webContents.send('updateConnectionStatus', this.connectionStatus);
            });

            this.socket.on('authenticated', () => {
                this.connectionStatus = {
                    state: SocketConnectionState.CONNECTED,
                    message: 'Connected',
                    description: 'Connection to server established.'
                };
                mainWindow.webContents.send('updateConnectionStatus', this.connectionStatus);
            });

            this.socket.on('disconnect', () => {
                this.connectionStatus =  {
                    state: SocketConnectionState.DISCONNECTED,
                    message: 'Disconnected',
                    description: 'Lost server connection, trying to reconnect...'
                };
                mainWindow.webContents.send('updateConnectionStatus', this.connectionStatus);
            });

            this.socket.on('parameter', (parameter: OscMessage) => {
                console.log('test message ', new Message('/avatar/parameters/Skin', 5));
                console.log('my message ', new Message('/avatar/parameters/' + parameter.address, parameter.args.at(0)!));
                console.log('parameter.args.at(0) ', typeof parameter.args.at(0));
                OscService.send(new Message('/avatar/parameters/' + parameter.address, parameter.args.at(0)!));
            });

        } else {
            if (this.socket) this.socket.close();
            this.connectionStatus =  {
                state: SocketConnectionState.DISCONNECTED,
                message: 'Not connected',
                description: 'Failed to start connection'
            };
            mainWindow.webContents.send('updateConnectionStatus', this.connectionStatus);
        }
    }

    static emitParameter(event: string, parameter: Message) {
        if (this.socket) {
            this.socket.emit(event, parameter);
        }
    }
}
