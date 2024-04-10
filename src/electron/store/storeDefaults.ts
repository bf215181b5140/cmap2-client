import { ClientCredentials } from '../../shared/classes';
import { Settings } from '../../shared/types/settings';
import { LovenseSettings, ToyCommandOscMessage, ToyCommandParameter } from '../../shared/lovense';
import { UpdaterSettings } from '../updater/updater.model';

type Store = {
    clientCredentials: ClientCredentials;
    settings: Settings;
    updater: UpdaterSettings;
    lovense: {
        settings: LovenseSettings,
        toyCommandOscMessage: ToyCommandOscMessage[],
        toyCommandParameter: ToyCommandParameter[]
    }
}

const storeDefaults: Store = {
    clientCredentials: {
        username: '',
        password: '',
        apiToken: null,
        displayName: null,
    },
    settings: {
        general: {
            startMinimized: false,
            enableVrcDetector: true,
            vrcDetectorFrequency: 10,
            oscIp: '127.0.0.1',
            oscInPort: 9000,
            oscOutPort: 9001
        },
        websocket: {
            autoLogin: true,
        }
    },
    updater: {
        autoCheckUpdates: true,
    },
    lovense: {
        settings: {
            sendConnectionOscMessage: false,
            connectionOscMessagePath: ''
        },
        toyCommandOscMessage: [],
        toyCommandParameter: []
    },
};

export default storeDefaults;
