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

    this.onChange('app', settings => app.setLoginItemSettings({ openAtLogin: settings.startOnBoot }));

    IPC.store.get((key) => this.get(key));
    IPC.store.getSync((key) => this.get(key));
    IPC.store.set((key, data) => this.set(key, data));
  }
}

export const SETTINGS = new SettingsStore();
