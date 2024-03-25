import { ClientCredentials } from '../../../shared/classes';
import { rendererSettingsStoreDefaults, Settings } from '../../../shared/store/main';
import { LovenseSettings, ToyCommandOscMessage, ToyCommandParameter } from '../../../shared/lovense';
import { RendererSettings } from '../../../shared/store/main';

interface MainStoreDefaultsType {
    clientCredentials: ClientCredentials,
    settings: Settings,
    lovense: {
        settings: LovenseSettings,
        toyCommandOscMessage: ToyCommandOscMessage[],
        toyCommandParameter: ToyCommandParameter[]
    },
    renderer: RendererSettings
}

const mainStoreDefaults: MainStoreDefaultsType = {
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
    lovense: {
        settings: {
            sendConnectionOscMessage: false,
            connectionOscMessagePath: ''
        },
        toyCommandOscMessage: [],
        toyCommandParameter: []
    },
    renderer: rendererSettingsStoreDefaults,
};

export default mainStoreDefaults;
