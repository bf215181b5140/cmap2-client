import { exec } from 'child_process';
import { IPC } from '../ipc/typedIpc.service';
import { BRIDGE } from '../bridge/bridge.service';
import { GameDetectorSettings } from '../../shared/objects/settings';
import { SETTINGS } from '../store/settings/settings.store';
import { DetectedGamesDTO } from 'cmap-shared';
import { DetectedGameSchema } from 'cmap-shared/src/enums/detectedGame';

export default class GameDetectorController {
  private intervalId: NodeJS.Timeout | null = null;
  private settings: GameDetectorSettings;

  constructor() {
    this.settings = SETTINGS.get('gameDetector');

    SETTINGS.onChange('gameDetector', data => {
      this.settings = data;
      this.resetInterval();
    });

    IPC.on('gameDetector:check', () => this.detectGames());

    this.resetInterval();
  }

  detectGames() {
    if (!this.settings.detectVRChat && !this.settings.detectChilloutVR) {
      // null means we're not tracking
      IPC.emit('gameDetector:detectedGames', null);
      BRIDGE.emit('gameDetector:detectedGames', null);
      return;
    }

    exec('tasklist', (err, stdout, stderr) => {
      if (err) return;

      const detectedGames: DetectedGamesDTO = [];
      if (this.settings.detectVRChat && stdout.toLowerCase().includes('vrchat.exe')) detectedGames.push(DetectedGameSchema.Values.VRChat);
      if (this.settings.detectChilloutVR && stdout.toLowerCase().includes('chilloutvr.exe')) detectedGames.push(DetectedGameSchema.Values.ChilloutVR);

      IPC.emit('gameDetector:detectedGames', detectedGames);
      BRIDGE.emit('gameDetector:detectedGames', detectedGames);
    });
  }

  resetInterval() {
    if (this.settings.detectVRChat || this.settings.detectChilloutVR) {
      // clear old interval if exists
      if (this.intervalId !== null) clearInterval(this.intervalId);
      // set new interval
      this.intervalId = setInterval(() => this.detectGames(), this.settings.frequency * 1000);
      // and detect it right away
      this.detectGames();
    } else {
      // clear old interval if exists
      if (this.intervalId !== null) clearInterval(this.intervalId);
      // Emmit that we are not tracking
      IPC.emit('gameDetector:detectedGames', null);
      BRIDGE.emit('gameDetector:detectedGames', null);
    }
  }
}
