import { WindowSize } from '../../../shared/enums';
import { Credentials } from '../../../shared/types';
import { AppSettings, OscSettings, SocketParameterBlacklist, SocketSettings, VrcDetectorSettings } from '../../../shared/schemas/settings.schema';

export interface SettingsStoreData {
    credentials: Credentials;
    app: AppSettings;
    vrcDetector: VrcDetectorSettings;
    osc: OscSettings;
    socket: SocketSettings;
    socketParameterBlacklist: SocketParameterBlacklist;
    // lovense: {
    //     sendConnectionOscMessage: boolean;
    //     connectionOscMessagePath: string;
    //     toyCommandOscMessage: [];
    //     toyCommandParameter: [];
    // };
}

export const settingsStoreDefaults: SettingsStoreData = {
    credentials: new Credentials(),
    app: {
        startOnBoot: false,
        startInBackground: false,
        windowSize: WindowSize.Medium,
    },
    vrcDetector: {
        detect: true,
        frequency: 10,
    },
    osc: {
        ip: '127.0.0.1',
        inPort: 9000,
        outPort: 9001
    },
    socket: {
        autoConnect: true,
    },
    socketParameterBlacklist: [],
    // lovense: {
    //     sendConnectionOscMessage: false,
    //     connectionOscMessagePath: '',
    //     toyCommandOscMessage: [],
    //     toyCommandParameter: []
    // },
};
