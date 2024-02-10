import { exec } from 'child_process';
import TypedIpcMain from '../ipc/typedIpcMain';
import { ApplicationSettings } from '../../shared/classes';
import { BridgeService } from '../bridge/bridge.service';

export default class VrcDetectorController {
    private intervalId: NodeJS.Timeout | null = null;
    private defaultFrequency: number = 10;
    private processName: string = 'vrchat.exe';

    constructor(applicationSettings: ApplicationSettings | null) {
        if (applicationSettings) this.resetInterval(applicationSettings);

        BridgeService.on('applicationSettings', (applicationSettings: ApplicationSettings) => this.resetInterval(applicationSettings));

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

    resetInterval(applicationSettings: ApplicationSettings) {
        if (applicationSettings?.enableVrcDetector === true) {
            // clear old interval if exists
            if (this.intervalId !== null) clearInterval(this.intervalId);
            // set new interval
            const frequency = applicationSettings.vrcDetectorFrequency ?? this.defaultFrequency; // in seconds
            this.intervalId = setInterval(() => this.isVrchatRunning(), frequency * 1000);

        } else if (applicationSettings?.enableVrcDetector === false) {
            // clear old interval if exists
            if (this.intervalId !== null) clearInterval(this.intervalId);
        }
    }
}
