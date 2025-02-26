import { Credentials } from '../../../shared/objects/credentials';
import { AppSettings, OscSettings, SocketSettings, TrackedParametersSettings, GameDetectorSettings } from '../../../shared/objects/settings';

export interface SettingsStoreData {
  credentials: Credentials;
  app: AppSettings;
  gameDetector: GameDetectorSettings;
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
  gameDetector: {
    detectVRChat: true,
    detectChilloutVR: true,
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
