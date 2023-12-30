import { ipcMain, IpcMainEvent } from 'electron';
import { mainWindow } from '../electron';
import { DeviceInformation, QRCodeData, ToyCommand } from 'lovense';
import { VrcParameter } from 'cmap2-shared';
import { LovenseStatus, ToyCommandParameter } from '../../shared/lovense';
import { BridgeService } from '../bridge/bridge.service';
import LovenseService from './lovense.service';
import { StoreService } from '../store/store.service';

// '/avatar/parameters/LovenseContact',
//                                     '/avatar/parameters/OGB/Pen/Penis/TouchOthers',
//                                     '/avatar/parameters/OGB/Pen/Penis/TouchSelf',
//                                     '/avatar/parameters/OGB/Pen/Penis/PenSelf',
//                                     '/avatar/parameters/OGB/Pen/Penis/PenOthers',
//                                     '/avatar/parameters/OGB/Pen/Penis/FrotOthers'

export default class LovenseController extends LovenseService {
    private lovenseStatus: LovenseStatus = new LovenseStatus();
    private lastCommand: number = 0;
    private toyCommandParameters: Map<string, ToyCommandParameter> = new Map<string, ToyCommandParameter>();

    constructor() {
        super();

        this.setToyCommandParameters(StoreService.getToyCommandParameters());

        ipcMain.on('getLovenseStatus', () => this.updateLovenseStatus());
        ipcMain.on('sendLovenseToyCommand', (_: IpcMainEvent, toyCommand: ToyCommand) => this.sendToyCommand(toyCommand));
        ipcMain.on('lovenseConnect', () => this.connect());
        ipcMain.on('lovenseDisconnect', () => this.disconnect());
        ipcMain.on('setToyCommandParameters', (_: IpcMainEvent, toyCommandParameters: ToyCommandParameter[]) => {
            this.setToyCommandParameters(toyCommandParameters);
        });

        BridgeService.on('vrcParameter', (vrcParameter: VrcParameter) => this.checkOscParameters(vrcParameter));
    }

    private setToyCommandParameters(toyCommandParameters: ToyCommandParameter[]): void {
        this.toyCommandParameters = new Map<string, ToyCommandParameter>(toyCommandParameters.map(toyCommandParameters => {
            return [toyCommandParameters.parameterPath, toyCommandParameters];
        }));
    }

    protected setQrCodeData(data: QRCodeData): void {
        this.lovenseStatus.qrCodeData = data;
        this.updateLovenseStatus();
    };

    protected setConnectionStatus(status: number): void {
        this.lovenseStatus.status = status;
        this.updateLovenseStatus();
    };

    protected setDeviceInformation(deviceInformation: DeviceInformation): void {
        this.lovenseStatus.deviceInformation = deviceInformation;
        this.updateLovenseStatus();
    };

    private checkOscParameters(vrcParameter: VrcParameter) {
        if (Date.now() - this.lastCommand < 300) return;

        const toyCommandParameter: ToyCommandParameter | undefined = this.toyCommandParameters.get(vrcParameter.path);
        if (toyCommandParameter) {

            let actionValue = 0;
            if (typeof vrcParameter.value === 'number') actionValue = Math.ceil(vrcParameter.value * 10);
            if (typeof vrcParameter.value === 'boolean') actionValue = vrcParameter.value ? 20 : 0;

            const toyCommand: ToyCommand = {
                command: 'Function',
                action: `${toyCommandParameter.action}:${actionValue}`,
                timeSec: toyCommandParameter.timeSec,
                toy: toyCommandParameter.toy,
                apiVer: 1
            };

            this.sendToyCommand(toyCommand);
            BridgeService.emit('toyCommand', toyCommand);
            this.lastCommand = Date.now();
        }
    }

    private updateLovenseStatus() {
        this.lovenseStatus.socketConnection = this.isSocketConnected();

        // todo this is ugly, fix
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('lovenseStatus', this.lovenseStatus);
        }
    }

    protected disconnect() {
        super.disconnect();
        this.lovenseStatus = new LovenseStatus();
        this.updateLovenseStatus();
    }
}
