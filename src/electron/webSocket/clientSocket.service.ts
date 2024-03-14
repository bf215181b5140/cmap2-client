import io from 'socket.io-client';
import { SocketConnection, SocketConnectionType } from '../../shared/SocketConnection';
import { VrcParameter } from 'cmap2-shared';
import { StoreService } from '../store/store.service';
import { URL } from '../../shared/const';
import TypedIpcMain from '../ipc/typedIpcMain';
import { BridgeService } from '../bridge/bridge.service';
import { ClientCredentials } from '../../shared/classes';
import { Settings } from '../../shared/types/settings';
import { Message } from 'node-osc';

export class ClientSocketService {
    private socket: SocketIOClient.Socket | undefined;
    private connectionStatus: SocketConnection = new SocketConnection();

    /**
     * Sets listeners for events and starts socket connection to server
     */
    constructor(settings: Settings) {
        TypedIpcMain.on('setClientCredentials', (clientCredentials) => this.connect(clientCredentials));
        TypedIpcMain.handle('getConnectionStatus', async () => this.connectionStatus);
        TypedIpcMain.on('disconnectSocket', () => this.disconnect());

        BridgeService.on('oscActivity', (isActive) => this.sendData('activity', isActive));
        BridgeService.on('vrcParameter', (vrcParameter: VrcParameter) => {
            if (vrcParameter.path.indexOf('/avatar/change') !== -1) {
                this.sendParameter('avatar', vrcParameter);
            } else {
                this.sendParameter('parameter', vrcParameter);
            }
        });

        if (settings.autoLogin) this.connect(StoreService.getClientCredentials());
    }

    /**
     * Starts socket connection with server and client credentials from electron-store.
     * Handles socket events.
     * @private
     */
    private connect(clientCredentials: ClientCredentials) {
        if (this.socket) this.socket.close();
        this.socket = io(URL + '/clientSocket', {
            query: {
                username: clientCredentials.username,
                password: clientCredentials.password
            },
            transports: ['websocket']
        });

        this.connectionStatus.setConnection(SocketConnectionType.MESSAGE, 'Connecting...', '');
        this.updateConnectionStatus();

        this.socket.on('joined', () => {
            this.connectionStatus.setConnection(SocketConnectionType.SUCCESS, 'Connected', '');
            this.updateConnectionStatus();
            BridgeService.emit('getOscActivity');
        });

        this.socket.on('error', (message: string) => {
            this.connectionStatus.setConnection(SocketConnectionType.ERROR, 'Error', message);
            this.updateConnectionStatus();
        });

        this.socket.on('connect_error', (err: Error) => {
            this.connectionStatus.setConnection(SocketConnectionType.ERROR, 'Error', err.message);
            this.updateConnectionStatus();
        });

        this.socket.on('disconnect', () => {
            this.connectionStatus.setConnection(SocketConnectionType.ERROR, 'Disconnected');
            this.updateConnectionStatus();
        });

        this.socket.on('parameter', (parameter: VrcParameter) => {
            BridgeService.emit('sendOscMessage', new Message(parameter.path, parameter.value));
        });
    }

    private disconnect() {
        if (this.socket) this.socket.close();
        this.connectionStatus.setConnection(SocketConnectionType.MESSAGE, 'Not connected', '');
        this.updateConnectionStatus();
    }

    /**
     * Sends vrc parameter to server, forwarded from OSC controller
     * @param event
     * @param parameter
     * @private
     */
    private sendParameter(event: 'parameter' | 'avatar', parameter: VrcParameter) {
        if (this.socket) {
            this.socket.emit(event, parameter);
        }
    }

    /**
     * Sends other data to server, that isn't vrc parameter from OSC controller
     * @param event
     * @param data
     * @private
     */
    private sendData(event: string, data: any) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    private updateConnectionStatus() {
        TypedIpcMain.emit('updateConnectionStatus', this.connectionStatus);
    }
}
