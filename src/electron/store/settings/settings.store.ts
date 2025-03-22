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
    this.onChange('trackedParameters', trackedParameters => IPC.emit('store:trackedParametersSettings', trackedParameters))

    IPC.store.get((key) => this.get(key));
    IPC.store.getSync((key) => this.get(key));
    IPC.store.set((key, data) => this.set(key, data));

    IPC.on('store:addParameterToBlacklist', path => {
      const trackedParameters = this.get('trackedParameters');
      if (!trackedParameters.blacklist.includes(path)) trackedParameters.blacklist.push(path);
      this.set('trackedParameters', trackedParameters);
    })
    IPC.on('store:removeParameterFromBlacklist', path => {
      const trackedParameters = this.get('trackedParameters');
      trackedParameters.blacklist = trackedParameters.blacklist.filter(p => p !== path);
      this.set('trackedParameters', trackedParameters);
    })
  }
}

export const SETTINGS = new SettingsStore();
