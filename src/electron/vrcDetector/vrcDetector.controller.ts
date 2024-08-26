import { exec } from 'child_process';
import { IPC } from '../ipc/typedIpc.service';
import { BRIDGE } from '../bridge/bridge.service';
import { VrcDetectorSettings } from '../../shared/schemas/settings.schema';
import { SETTINGS } from '../store/settings/settings.store';

export default class VrcDetectorController {
    private intervalId: NodeJS.Timeout | null = null;
    private processName: string = 'vrchat.exe';
    private detecting: boolean = false;

    constructor() {
        this.resetInterval(SETTINGS.get('vrcDetector'));

        IPC.on('setVrcDetectorSettings', (data) => this.resetInterval(data));
        IPC.on('checkIsVrcDetected', () => this.detectVrchat());
    }

    detectVrchat() {
        if (!this.detecting) {
            // null means we're not tracking
            IPC.emit('isVrcDetected', null);
            BRIDGE.emit('isVrcDetected', null);
            return;
        }

        exec('tasklist', (err, stdout, stderr) => {
            if (err) return;

            const detected = stdout.toLowerCase().includes(this.processName.toLowerCase());
            IPC.emit('isVrcDetected', detected);
            BRIDGE.emit('isVrcDetected', detected);
        });
    }

    resetInterval(settings: VrcDetectorSettings) {
        this.detecting = settings.detect;

        if (this.detecting) {
            // clear old interval if exists
            if (this.intervalId !== null) clearInterval(this.intervalId);
            // set new interval
            this.intervalId = setInterval(() => this.detectVrchat(), settings.frequency * 1000);
        } else {
            // clear old interval if exists
            if (this.intervalId !== null) clearInterval(this.intervalId);
            // Emmit that we are not tracking
            IPC.emit('isVrcDetected', null);
            BRIDGE.emit('isVrcDetected', null);
        }
    }
}
