import { io, Socket } from 'socket.io-client';
import { OscService } from '../osc/osc.service';
import { Message } from 'node-osc';
import { SocketConnection, SocketConnectionType } from '../../shared/SocketConnection';
import { OscMessage } from 'cmap2-shared';
import { ClientCredentials } from '../../shared/classes';
import { ClientStoreService } from '../util/clientStore.service';
import { mainWindow } from '../electron';

export class ClientSocketService {

    static socket: Socket;
    static connectionStatus: SocketConnection = new SocketConnection();

    static init() {
        const clientCredentials = ClientStoreService.getClientCredentials();
        if (clientCredentials && clientCredentials.autoLogin) {
            this.connect(clientCredentials);
        }
    }

    static connect(clientCredentials: ClientCredentials) {
        if (this.socket) this.socket.close();
        this.socket = io(clientCredentials.serverUrl + '/clientSocket', {
            query: {
                username: clientCredentials.username,
                password: clientCredentials.password
            }
        });

        this.connectionStatus.setConnection(SocketConnectionType.MESSAGE, 'Connecting...', '');
        this.updateConnectionStatus()

        this.socket.on('joined', () => {
            this.connectionStatus.setConnection(SocketConnectionType.SUCCESS, 'Connected', '');
            this.updateConnectionStatus()
        });

        this.socket.on('error', (message: string) => {
            this.connectionStatus.setConnection(SocketConnectionType.ERROR, 'Error', message);
            this.updateConnectionStatus()
        });

        this.socket.on('disconnect', () => {
            this.connectionStatus.setConnection(SocketConnectionType.ERROR, 'Disconnected');
            this.updateConnectionStatus()
        });

        this.socket.on('parameter', (parameter: OscMessage) => {
            OscService.send(new Message('/avatar/parameters/' + parameter.address, parameter.args.at(0)!));
        });
    }

    static disconnect() {
        if (this.socket) this.socket.close();
        this.connectionStatus.setConnection(SocketConnectionType.MESSAGE, 'Not connected', '');
        this.updateConnectionStatus()
    }

    static sendParameter(event: string, parameter: Message) {
        if (this.socket) {
            this.socket.emit(event, parameter);
        }
    }

    static updateConnectionStatus() {
        if (mainWindow) mainWindow.webContents.send('updateConnectionStatus', this.connectionStatus);
    }
}
