import { exec } from 'child_process';
import { IPC } from '../ipc/typedIpc.service';
import { BRIDGE } from '../bridge/bridge.service';
import { VrcDetectorSettings } from '../../shared/objects/settings';
import { SETTINGS } from '../store/settings/settings.store';

export default class VrcDetectorController {
  private intervalId: NodeJS.Timeout | null = null;
  private processName: string = 'vrchat.exe';
  private settings: VrcDetectorSettings;

  constructor() {
    this.settings = SETTINGS.get('vrcDetector');

    SETTINGS.onChange('vrcDetector', data => {
      this.settings = data;
      this.resetInterval();
    });

    IPC.on('vrcDetector:check', () => this.detectVrchat());

    this.resetInterval();
  }

  detectVrchat() {
    if (!this.settings.detect) {
      // null means we're not tracking
      IPC.emit('vrcDetector:detection', null);
      BRIDGE.emit('vrcDetector:detection', null);
      return;
    }

    exec('tasklist', (err, stdout, stderr) => {
      if (err) return;

      const detected = stdout.toLowerCase().includes(this.processName.toLowerCase());
      IPC.emit('vrcDetector:detection', detected);
      BRIDGE.emit('vrcDetector:detection', detected);
    });
  }

  resetInterval() {
    if (this.settings.detect) {
      // clear old interval if exists
      if (this.intervalId !== null) clearInterval(this.intervalId);
      // set new interval
      this.intervalId = setInterval(() => this.detectVrchat(), this.settings.frequency * 1000);
      // and detect it right away
      this.detectVrchat();
    } else {
      // clear old interval if exists
      if (this.intervalId !== null) clearInterval(this.intervalId);
      // Emmit that we are not tracking
      IPC.emit('vrcDetector:detection', null);
      BRIDGE.emit('vrcDetector:detection', null);
    }
  }
}
