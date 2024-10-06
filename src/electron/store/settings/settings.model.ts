import { Credentials } from '../../../shared/objects/credentials';
import { AppSettings, OscSettings, OscStateSettings, SocketParameterBlacklist, SocketSettings, VrcDetectorSettings } from '../../../shared/objects/settings';

export interface SettingsStoreData {
    credentials: Credentials;
    app: AppSettings;
    vrcDetector: VrcDetectorSettings;
    osc: OscSettings;
    oscState: OscStateSettings;
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
        windowSize: 'Medium',
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
    oscState: {
        clearOnAvatarChange: true,
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
