import { URL } from '../../shared/const';
import { ipcMain, IpcMainEvent } from 'electron';
import { mainWindow } from '../electron';
import io from 'socket.io-client';
import { ConnectionStatus, DeviceInformation, QRCodeResponse, SocketIoData, SocketIoResponse, ToyCommand } from 'lovense';
import { VrcParameter } from 'cmap2-shared';
import { LovenseStatus } from '../../shared/lovense/lovenseStatus';

export class LovenseController {

    static authToken: string | null;
    static socketInfo: SocketIoData | null;
    static lovenseSocket: SocketIOClient.Socket | null;

    static lastCommand: number = 0;

    static lovenseStatus: LovenseStatus = new LovenseStatus();

    static touchParameters: string[] = ['/avatar/parameters/LovenseContact',
                                        '/avatar/parameters/OGB/Pen/Penis/TouchOthers',
                                        '/avatar/parameters/OGB/Pen/Penis/TouchSelf',
                                        '/avatar/parameters/OGB/Pen/Penis/PenSelf',
                                        '/avatar/parameters/OGB/Pen/Penis/PenOthers',
                                        '/avatar/parameters/OGB/Pen/Penis/FrotOthers'];

    static sendToyCommand(toyCommand: ToyCommand) {
        if (!this.lovenseSocket) return;
        this.lovenseSocket.emit('basicapi_send_toy_command_ts', toyCommand);
    }

    // todo
    static checkParameter(vrcParameter: VrcParameter) {
        if (!this.lovenseSocket) return;
        if (Date.now() - this.lastCommand < 300) return;
        if (this.touchParameters.includes(vrcParameter.path) && typeof vrcParameter.value === 'number') {
            const toyCommand: ToyCommand = {
                command: 'Function',
                action: 'Vibrate:' + (Math.ceil(vrcParameter.value * 10)),
                timeSec: 1,
                apiVer: 1
            };
            this.sendToyCommand(toyCommand);
            this.lastCommand = Date.now();
        }
    }

    static updateLovenseStatus() {
        this.lovenseStatus.socketConnection = !!this.lovenseSocket?.connected;
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('lovenseStatus', this.lovenseStatus);
        }
    }

    static init() {
        ipcMain.on('getLovenseStatus', () => this.updateLovenseStatus());
        ipcMain.on('sendLovenseToyCommand', (event: IpcMainEvent, toyCommand: ToyCommand) => this.sendToyCommand(toyCommand));
        ipcMain.on('lovenseConnect', () => this.connect());
        ipcMain.on('lovenseDisconnect', () => this.disconnect());
    }

    static async connect(): Promise<void> {
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

        const ackId = '24fsf2536fs7324hj647f5';
        this.lovenseSocket.emit('basicapi_get_qrcode_ts', {
            ackId: ackId
        });

        // Trigger: when 'basicapi_get_qrcode_ts' event is sent
        this.lovenseSocket.on('basicapi_get_qrcode_tc', (data: string) => {
            let QRCodeResponse: QRCodeResponse = data ? JSON.parse(data) : {};
            console.log('Lovense basicapi_get_qrcode_tc');
            if (QRCodeResponse?.data && QRCodeResponse?.data?.ackId === ackId) {
                this.lovenseStatus.qrCodeData = QRCodeResponse.data;
                this.updateLovenseStatus();
            }
        });

        // Trigger: user scans the code to establish a connection
        this.lovenseSocket.on('basicapi_update_app_status_tc', (data: any) => {
            let resData: ConnectionStatus = data ? JSON.parse(data) : {};
            console.log('Lovense basicapi_update_app_status_tc: ', resData);
            this.lovenseStatus.status = resData.status;
            this.updateLovenseStatus();
        });

        // Trigger: the connection status of Lovense APP and Lovense server
        this.lovenseSocket.on('basicapi_update_app_online_tc', (data: any) => {
            let resData = data ? JSON.parse(data) : {};
            // Returns the app network status
            console.log('Lovense basicapi_update_app_online_tc: ', resData);
            this.lovenseStatus.status = resData.status;
            this.updateLovenseStatus();
        });

        // Trigger: device information update
        this.lovenseSocket.on('basicapi_update_device_info_tc', (data: string) => {
            let deviceInformation: DeviceInformation = data ? JSON.parse(data) : {};
            console.log('Lovense basicapi_update_device_info_tc: ', deviceInformation);
            this.lovenseStatus.deviceInformation = deviceInformation;
            this.updateLovenseStatus();
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

    static disconnect() {
        if (this.lovenseSocket) this.lovenseSocket.close();
        this.lovenseStatus = new LovenseStatus();
        this.updateLovenseStatus();
    }

    private static async getAuthToken(): Promise<string | undefined> {
        const url = URL + '/api/lovense';

        const apiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhd2tzIiwiaWF0IjoxNzAzNDI3NzIwfQ.jn4xo6Oro2v3YcKr8JprGeea_Gzlebvvyer5viM3AC0';
        // todo
        // const apiToken = ClientStoreService.getClientCredentials()?.apiToken;
        // if (!apiToken) throw new Error('apiToken is undefined');

        return await fetch(url, {
            method: 'GET',
            headers: {'Authorization': '' + apiToken, 'Content-Type': 'application/json'},
        }).then(async res => {
            if (res.ok || res.status === 200) {
                return await res.text();
            } else {
                throw new Error('Can\'t get lovense authToken from server: ' + res.status);
            }
        });
    }

    private static async validateAuthToken(): Promise<SocketIoData | undefined> {
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
                throw new Error('Lovense validation failed: ' + response.message);
            }
        });
    }

}
