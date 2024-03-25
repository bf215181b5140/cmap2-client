import { exec } from 'child_process';
import TypedIpcMain from '../ipc/typedIpcMain';
import { GeneralSettings } from '../../shared/types/settings';
import { StoreService } from '../store/store.service';

export default class VrcDetectorService {
    private intervalId: NodeJS.Timeout | null = null;
    private defaultFrequency: number = 10;
    private processName: string = 'vrchat.exe';
    private enableVrcDetector: boolean = false;

    constructor() {
        this.resetInterval(StoreService.getGeneralSettings());

        TypedIpcMain.on('setGeneralSettings', (data) => this.resetInterval(data));

        TypedIpcMain.on('getIsVrchatRunning', () => this.isVrcRunning());
    }

    isVrcRunning() {
        if (!this.enableVrcDetector) {
            TypedIpcMain.emit('isVrchatRunning', null);
            return;
        }

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

    resetInterval(settings: GeneralSettings) {
        this.enableVrcDetector = settings.enableVrcDetector;

        if (this.enableVrcDetector) {
            // clear old interval if exists
            if (this.intervalId !== null) clearInterval(this.intervalId);
            // set new interval
            const frequency = settings.vrcDetectorFrequency ?? this.defaultFrequency; // in seconds
            this.intervalId = setInterval(() => this.isVrcRunning(), frequency * 1000);
        } else {
            // clear old interval if exists
            if (this.intervalId !== null) clearInterval(this.intervalId);
        }
    }
}
