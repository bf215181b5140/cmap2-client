import { DeviceInformation, QRCodeData } from 'lovense';

export class LovenseStatus {
    socketConnection: boolean = false;
    status: number | null = null;
    qrCodeData: QRCodeData | null = null;
    deviceInformation: DeviceInformation | null = null;
}

