import Store from 'electron-store';
import { ClientCredentials } from '../../shared/classes';
import { LovenseSettings, ToyCommandOscMessage, ToyCommandParameter } from '../../shared/lovense';
import { BridgeService } from '../bridge/bridge.service';
import { Settings } from '../../shared/types/settings';

const defaultSettings: Settings = {
  startMinimized: false,
  autoLogin: true,
  enableVrcDetector: true,
  vrcDetectorFrequency: 10,
  oscIp: '127.0.0.1',
  oscInPort: 9000,
  oscOutPort: 9001
}

export class StoreService {
    private static clientStore = new Store({
        encryptionKey: 'client-settings',
        defaults: {
            settings: defaultSettings
        }
    });

    static getClientCredentials(): ClientCredentials | null {
        return this.clientStore.get('clientCredentials') as ClientCredentials;
    }

    static setClientCredentials(clientCredentials: ClientCredentials) {
        this.clientStore.set('clientCredentials', clientCredentials);
    }

    static getSettings(): Settings {
        return this.clientStore.get('settings');
    }

    static setSettings(settings: Settings) {
        this.clientStore.set('settings', settings);
        BridgeService.emit('settings', settings);
    }

    static getToyCommandParameters(): ToyCommandParameter[] {
        return this.clientStore.get('toyCommandParameters') as ToyCommandParameter[] ?? [];
    }

    static setToyCommandParameters(toyCommandParameters: ToyCommandParameter[]) {
        this.clientStore.set('toyCommandParameters', toyCommandParameters);
    }

    static getToyCommandOscMessages(): ToyCommandOscMessage[] {
        return this.clientStore.get('toyCommandOscMessages') as ToyCommandOscMessage[] ?? [];
    }

    static setToyCommandOscMessages(toyCommandOscMessages: ToyCommandOscMessage[]) {
        this.clientStore.set('toyCommandOscMessages', toyCommandOscMessages);
    }

    static getLovenseSettings(): LovenseSettings {
        return this.clientStore.get('lovenseSettings') as LovenseSettings ?? new LovenseSettings();
    }

    static setLovenseSettings(lovenseSettings: LovenseSettings) {
        this.clientStore.set('lovenseSettings', lovenseSettings);
    }
}
