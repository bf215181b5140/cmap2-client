import { exec } from 'child_process';
import TypedIpcMain from '../ipc/typedIpcMain';
import { BridgeService } from '../bridge/bridge.service';
import { Settings } from '../../shared/types/settings';
import { StoreService } from '../store/store.service';

export default class VrcDetectorService {
    private intervalId: NodeJS.Timeout | null = null;
    private defaultFrequency: number = 10;
    private processName: string = 'vrchat.exe';

    constructor() {
        this.resetInterval(StoreService.getSettings());

        BridgeService.on('settings', (settings) => this.resetInterval(settings));

        TypedIpcMain.on('getIsVrchatRunning', () => this.isVrchatRunning());
    }

    isVrchatRunning() {
        exec('tasklist', (err, stdout, stderr) => {
            if (err) {
                return;
            }

            if (stdout.toLowerCase().includes(this.processName.toLowerCase())) {
                TypedIpcMain.emit('isVrchatRunning', true);
            } else {
                TypedIpcMain.emit('isVrchatRunning', false);
            }
        });
    }

    resetInterval(settings: Settings) {
        if (settings.enableVrcDetector) {
            // clear old interval if exists
            if (this.intervalId !== null) clearInterval(this.intervalId);
            // set new interval
            const frequency = settings.vrcDetectorFrequency ?? this.defaultFrequency; // in seconds
            this.intervalId = setInterval(() => this.isVrchatRunning(), frequency * 1000);

        } else {
            // clear old interval if exists
            if (this.intervalId !== null) clearInterval(this.intervalId);
        }
    }
}
