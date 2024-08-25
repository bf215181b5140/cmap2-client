import { WindowSize } from '../../../shared/enums';
import { Credentials } from '../../../shared/types';

export const settingsDefaults = {
    credentials: new Credentials(),
    app: {
        startOnBoot: false,
        startInBackground: false,
        windowSize: WindowSize.Medium,
    },
    osc: {
        ip: '127.0.0.1',
        inPort: 9000,
        outPort: 9001
    },
    vrcDetector: {
        detectVrchat: true,
        frequency: 10,
    },
    socket: {
        autoConnect: true,
    },
    lovense: {
        sendConnectionOscMessage: false,
        connectionOscMessagePath: '',
        toyCommandOscMessage: [],
        toyCommandParameter: []
    },
};

export type StoreSettings = typeof settingsDefaults;