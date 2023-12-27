declare module 'lovense' {

    interface SocketIoResponse {
        code: number,
        message: string,
        data: SocketIoData,
    }

    interface SocketIoData {
        'socketIoPath': string,
        'socketIoUrl': string
    }

    interface QRCodeResponse {
        code: number,
        message: string,
        data: QRCodeData,
    }

    interface QRCodeData {
        qrcodeUrl: string,
        qrcode: string,
        ackId?: string,
    }

    interface ConnectionStatus {
        status: number,
    }

    interface DeviceInformation {
        deviceCode: string,
        online: boolean,
        domain: string,
        httpsPort: number,
        wssPort: number,
        appVersion: string,
        platform: string,
        appType: string,
        toyList: Toy[],
    }

    interface Toy {
        id: string,
        name: string,
        toyType: string,
        nickname: string,
        hVersion: string,
        fVersion: number,
        battery: number,
        connected: boolean,
    }

    interface ToyCommand {
        command: 'Function',
        action: string,
        // Actions can be: Vibrate, Rotate, Pump, Thrusting, Fingering, Suction, Depth or Stop.
        // Use All to make all functions respond.
        // Use Stop to stop the toy’s response.
        // Range:
        // Vibrate:0~20
        // Rotate:0~20
        // Pump:0~3
        // Thrusting:0~20
        // Fingering:0~20
        // Suction:0~20
        // Depth:0~3
        // All:0~20
        // Stop
        timeSec: number,
        // Total running time
        // 0 = indefinite length
        // Otherwise, running time should be greater than 1.
        loopRunningSec?: number,
        // Running time
        // Should be greater than 1
        loopPauseSec?: number,
        // Suspend time
        // Should be greater than 1
        toy?: string,
        // Toy ID
        // If you don’t include this, it will be applied to all toys
        stopPrevious?: boolean,
        // Stop all previous commands and execute current commands
        // Default: 1, If set to 0 , it will not stop the previous command.
        apiVer: 1,
    }
}
