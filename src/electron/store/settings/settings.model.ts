import { Credentials } from '../../../shared/objects/credentials';
import { AppSettings, OscSettings, SocketSettings, TrackedParametersSettings, VrcDetectorSettings } from '../../../shared/objects/settings';

export interface SettingsStoreData {
  credentials: Credentials;
  app: AppSettings;
  vrcDetector: VrcDetectorSettings;
  osc: OscSettings;
  trackedParameters: TrackedParametersSettings;
  socket: SocketSettings;
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
  trackedParameters: {
    clearOnAvatarChange: true,
    blacklist: [],
  },
  socket: {
    autoConnect: true,
  },
};
