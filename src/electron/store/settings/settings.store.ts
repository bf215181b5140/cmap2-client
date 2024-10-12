import { IPC } from '../../ipc/typedIpc.service';
import CmapStore from '../cmapStore';
import { SettingsStoreData, settingsStoreDefaults } from './settings.model';
import { BRIDGE } from '../../bridge/bridge.service';
import { app } from 'electron';

class SettingsStore extends CmapStore<SettingsStoreData> {

  constructor() {
    super({
      name: 'settings',
      defaults: settingsStoreDefaults
    });

    // Credentials
    IPC.handle('getCredentials', async () => this.get('credentials'));
    IPC.on('setCredentials', data => this.set('credentials', data));

    // App settings
    IPC.handle('getAppSettings', async () => this.get('app'));
    IPC.on('saveAppSettings', data => {
      this.set('app', data);
      app.setLoginItemSettings({ openAtLogin: data.startOnBoot });
    });

    // VRC detector
    IPC.handle('getVrcDetectorSettings', async () => this.get('vrcDetector'));
    IPC.on('saveVrcDetectorSettings', data => this.set('vrcDetector', data));

    // OSC
    IPC.handle('getOscSettings', async () => this.get('osc'));
    IPC.on('saveOscSettings', data => this.set('osc', data));

    // Tracked parameters
    IPC.handle('getTrackedParametersSettings', async () => this.get('trackedParameters'));
    IPC.on('saveTrackedParametersSettings', data => this.set('trackedParameters', data));

    // Socket
    IPC.handle('getSocketSettings', async () => this.get('socket'));
    IPC.on('saveSocketSettings', data => this.set('socket', data));
    IPC.on('saveSocketParameterBlacklist', data => this.set('socketParameterBlacklist', data));

    // change window size
    BRIDGE.on('setWindowSize', (data) => this.set('app.windowSize', data));
  }
}

export const SETTINGS = new SettingsStore();
