import io from 'socket.io-client';
import { WebsocketConnection, WebsocketConnectionStatus } from '../../shared/webSocket';
import { VrcParameter } from 'cmap2-shared';
import { StoreService } from '../store/store.service';
import { WEBSITE_URL } from '../../shared/const';
import TypedIpcMain from '../ipc/typedIpcMain';
import { BridgeService } from '../bridge/bridge.service';
import { ClientCredentials } from '../../shared/classes';
import { Message } from 'node-osc';

export class ClientSocketService {
    private socket: SocketIOClient.Socket | undefined;
    private connectionStatus: WebsocketConnection = new WebsocketConnection();

    /**
     * Sets listeners for events and starts socket connection to server
     */
    constructor() {
        TypedIpcMain.on('setClientCredentials', (clientCredentials) => {
            if (this.connectionStatus.status === 'Connected' || StoreService.getWebsocketSettings().autoLogin) {
                this.connect(clientCredentials);
            }
        });
        TypedIpcMain.handle('getConnectionStatus', async () => this.connectionStatus);
        TypedIpcMain.on('connectSocket', () => this.connect(StoreService.getClientCredentials()));
        TypedIpcMain.on('disconnectSocket', () => this.disconnect());

        BridgeService.on('isVrchatRunning', (data) => this.sendData('isVrchatRunning', data));
        BridgeService.on('vrcParameter', (vrcParameter: VrcParameter) => {
            this.sendParameter(vrcParameter);
        });

        if (StoreService.getWebsocketSettings().autoLogin) this.connect(StoreService.getClientCredentials());
    }

    /**
     * Starts socket connection with server and client credentials from electron-store.
     * Handles socket events.
     * @private
     */
    private connect(clientCredentials: ClientCredentials) {
        if (this.socket) this.socket.close();

        if (typeof clientCredentials.apiToken !== 'string') return;

        this.socket = io(WEBSITE_URL + '/clientSocket', {
            query: {
                apiToken: clientCredentials.apiToken
            },
            transports: ['websocket']
        });

        this.updateConnectionStatus('Connecting');

        this.socket.on('joined', () => {
            this.updateConnectionStatus('Connected');
            BridgeService.emit('getOscActivity');
        });

        this.socket.on('error', (message: string) => {
            this.updateConnectionStatus('Not connected', message);
        });

        this.socket.on('connect_error', (err: Error) => {
            this.updateConnectionStatus('Not connected', err.message);
        });

        this.socket.on('disconnect', () => {
            this.updateConnectionStatus('Not connected');
        });

        this.socket.on('parameter', (parameter: VrcParameter) => {
            BridgeService.emit('sendOscMessage', new Message(parameter.path, parameter.value));
        });
    }

    private disconnect() {
        if (this.socket) this.socket.close();
        this.updateConnectionStatus('Not connected');
    }

    private updateConnectionStatus(status: WebsocketConnectionStatus, message?: string) {
        this.connectionStatus.setStatus(status, message);
        TypedIpcMain.emit('updateConnectionStatus', this.connectionStatus);
    }

    /**
     * Sends vrc parameter to server, forwarded from OSC controller
     * @param event
     * @param parameter
     * @private
     */
    private sendParameter(parameter: VrcParameter) {
        if (this.socket) {
            this.socket.emit('parameter', parameter);
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
}
