import { ClientCredentials } from '../../shared/classes';
import { Settings } from '../../shared/types/settings';
import { LovenseSettings, ToyCommandOscMessage, ToyCommandParameter } from '../../shared/lovense';

type Store = {
    clientCredentials: ClientCredentials,
    settings: Settings,
    lovenseSettings: LovenseSettings,
    toyCommandOscMessage: ToyCommandOscMessage[],
    toyCommandParameter: ToyCommandParameter[]
}

const storeDefaults: Store = {
    clientCredentials: {
        username: '',
        password: '',
        apiToken: null
    },
    settings: {
        startMinimized: false,
        autoLogin: true,
        enableVrcDetector: true,
        vrcDetectorFrequency: 10,
        oscIp: '127.0.0.1',
        oscInPort: 9000,
        oscOutPort: 9001
    },
    lovenseSettings: {
        sendConnectionOscMessage: false,
        connectionOscMessagePath: ''
    },
    toyCommandOscMessage: [],
    toyCommandParameter: []
};

export default storeDefaults;
