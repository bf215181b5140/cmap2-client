import { WindowSize } from '../../../shared/enums';
import { Credentials } from '../../../shared/types';
import { AppSettings, VrcDetectorSettings } from '../../../shared/schemas/settings.schema';

export interface StoreSettings {
    credentials: Credentials;
    app: AppSettings;
    vrcDetector: VrcDetectorSettings;
    // osc: {
    //     ip: string;
    //     inPort: number;
    //     outPort: number;
    // };
    socket: {
        autoConnect: boolean;
    };
    // lovense: {
    //     sendConnectionOscMessage: boolean;
    //     connectionOscMessagePath: string;
    //     toyCommandOscMessage: [];
    //     toyCommandParameter: [];
    // };
}

export const settingsDefaults: StoreSettings = {
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
    // osc: {
    //     ip: '127.0.0.1',
    //     inPort: 9000,
    //     outPort: 9001
    // },
    socket: {
        autoConnect: true,
    },
    // lovense: {
    //     sendConnectionOscMessage: false,
    //     connectionOscMessagePath: '',
    //     toyCommandOscMessage: [],
    //     toyCommandParameter: []
    // },
};
