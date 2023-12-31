import io from 'socket.io-client';
import { ConnectionStatus, DeviceInformation, QRCodeData, QRCodeResponse, SocketIoData, SocketIoResponse, ToyCommand } from 'lovense';
import { URL } from '../../shared/const';
import { StoreService } from '../store/store.service';

export default abstract class LovenseService {
    private authToken: string | null = null;
    private socketInfo: SocketIoData | null = null;
    private lovenseSocket: SocketIOClient.Socket | null = null;
    private lastToyCommand: number = 0; // unix timestamp
    protected toyCommandFrequency: number = 300; // milliseconds

    protected abstract setQrCodeData(data: QRCodeData): void;
    protected abstract setConnectionStatus(status: number): void;
    protected abstract setDeviceInformation(deviceInformation: DeviceInformation): void;

    protected constructor() {
        console.log('LovenseService constructor');
    }

    protected isSocketConnected(): boolean {
        return !!this.lovenseSocket?.connected;
    }

    protected canSendToyCommand(): boolean {
        return (Date.now() - this.lastToyCommand > this.toyCommandFrequency) && this.isSocketConnected();
    }

    protected sendToyCommand(toyCommand: ToyCommand) {
        if (!this.lovenseSocket) return;
        this.lovenseSocket.emit('basicapi_send_toy_command_ts', toyCommand);
        this.lastToyCommand = Date.now();
    }

    protected async connect(): Promise<void> {
        console.log('Connecting to Lovense...');

        if (this.lovenseSocket) this.lovenseSocket.close();

        if (!this.authToken) {
            const authToken = await this.getAuthToken();
            if (typeof authToken !== 'string') return;
            this.authToken = authToken;
        }

        if (!this.socketInfo) {
            const socketInfo = await this.validateAuthToken();
            if (!socketInfo) return;
            this.socketInfo = socketInfo;
        }

        this.lovenseSocket = io(this.socketInfo.socketIoUrl, {
            transports: ['websocket'],
            path: this.socketInfo.socketIoPath
        });

        // todo rng
        const ackId = '24fsf2536fs7324hj647f5';
        this.lovenseSocket.emit('basicapi_get_qrcode_ts', {
            ackId: ackId
        });

        // Trigger: when 'basicapi_get_qrcode_ts' event is sent
        this.lovenseSocket.on('basicapi_get_qrcode_tc', (data: string) => {
            console.log('Lovense basicapi_get_qrcode_tc');

            let QRCodeResponse: QRCodeResponse = data ? JSON.parse(data) : {};

            // todo validate data
            if (QRCodeResponse?.data && QRCodeResponse?.data?.ackId === ackId) {
                this.setQrCodeData(QRCodeResponse.data);
            }
        });

        // Trigger: user scans the code to establish a connection
        this.lovenseSocket.on('basicapi_update_app_status_tc', (data: string) => {
            console.log('Lovense basicapi_update_app_status_tc');

            let resData: ConnectionStatus = data ? JSON.parse(data) : {};

            // todo validate data
            this.setConnectionStatus(resData.status);
        });

        // Trigger: the connection status of Lovense APP and Lovense server
        this.lovenseSocket.on('basicapi_update_app_online_tc', (data: string) => {
            console.log('Lovense basicapi_update_app_online_tc');
            // Returns the app network status

            let resData: ConnectionStatus = data ? JSON.parse(data) : {};

            // todo validate data
            this.setConnectionStatus(resData.status);
        });

        // Trigger: device information update
        this.lovenseSocket.on('basicapi_update_device_info_tc', (data: string) => {
            console.log('Lovense basicapi_update_device_info_tc');

            let deviceInformation: DeviceInformation = data ? JSON.parse(data) : {};

            // todo validate data
            this.setDeviceInformation(deviceInformation);
        });

        this.lovenseSocket.on('error', (data: any) => {
            console.log('Lovense socket error', data);
            this.disconnect();
        });

        this.lovenseSocket.on('connect_error', (data: any) => {
            console.log('Lovense socket connect_error', data);
            this.disconnect();
        });

        this.lovenseSocket.on('disconnect', (data: any) => {
            console.log('Lovense socket disconnected');
            this.disconnect();
        });
    }

    protected disconnect(): void {
        if (this.lovenseSocket) this.lovenseSocket.close();
    }

    private async getAuthToken(): Promise<string | void> {
        const url = URL + '/api/lovense';

        const apiToken = StoreService.getClientCredentials()?.apiToken;
        if (!apiToken) {
            console.log('apiToken is undefined');
            return;
        }

        return await fetch(url, {
            method: 'GET',
            headers: {'Authorization': '' + apiToken, 'Content-Type': 'application/json'},
        }).then(async res => {
            if (res.ok || res.status === 200) {
                return await res.text();
            } else {
                console.log('Can\'t get lovense authToken from Cmap server, status code:', res.status);
            }
        }).catch(_ => console.log('Can\'t connect to Cmap server'));
    }

    private async validateAuthToken(): Promise<SocketIoData | void> {
        if (!this.authToken) throw new Error('authToken is undefined');

        const url = 'https://api.lovense-api.com/api/basicApi/getSocketUrl';

        return await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                platform: 'Cmap',
                authToken: this.authToken
            })
        }).then(async data => {
            const response: SocketIoResponse = await data.json();
            if (response.code === 0) {
                return response.data;
            } else {
                console.log('Lovense validation failed: ' + response.message);
            }
        }).catch(_ => console.log('Can\'t connect to Lovense API server'));
    }

}
