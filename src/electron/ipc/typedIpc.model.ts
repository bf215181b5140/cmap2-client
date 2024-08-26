import { WindowState } from '../../shared/enums';
import { AppSettings, VrcDetectorSettings } from '../../shared/schemas/settings.schema';
import { Credentials } from '../../shared/types';

export type IpcGetOptions = {
    getAppVersion: string;
    getCredentials: Credentials;
    getAppSettings: AppSettings;
    getVrcDetectorSettings: VrcDetectorSettings;
    getSocketConnected: boolean;
    // getGeneralSettings: GeneralSettings;
    // getWebsocketSettings: WebsocketSettings;
    // getLovenseSettings: LovenseSettings;
    // getToyCommandParameters: ToyCommandParameter[];
    // getToyCommandOscMessages: ToyCommandOscMessage[];
    // getFingerprint: string;
    // getLastOscActivity: number;
    // // Osc status
    // getTrackedParameters: Map<string, boolean | number | string>;
    // // VrcOscData
    // getVrcOscAvatars: VrcOscAvatar[];
    // // Osc control
    // getOscClockSettings: OscClockSettings;
};

export type IpcSendOptions = {
    setWindowState: WindowState;
    setCredentials: Credentials;
    setAppSettings: AppSettings;
    setVrcDetectorSettings: VrcDetectorSettings;
    checkIsVrcDetected: void;
    connectSocket: undefined;
    disconnectSocket: undefined;
    // setGeneralSettings: GeneralSettings;
    // setWebsocketSettings: WebsocketSettings;
    // setLovenseSettings: LovenseSettings;
    // getLovenseStatus: undefined;
    // lovenseConnect: undefined;
    // lovenseDisconnect: undefined;
    // sendLovenseToyCommand: ToyCommand;
    // setToyCommandParameters: ToyCommandParameter[];
    // setToyCommandOscMessages: ToyCommandOscMessage[];
    // getIsVrchatRunning: undefined;
    // // Osc status
    // setTrackedParameters: Map<string, boolean | number | string>;
    // setTrackedParameter: ClientStateParamDTO;
    // deleteTrackedParameter: ClientStateParamDTO;
    // // VrcOscData
    // setVrcOscAvatars: VrcOscAvatar[];
    // // Osc control
    // setOscClockSettings: OscClockSettings;
    // // Updater
    // checkForUpdates: undefined;
    // startUpdate: string;
};

export type IpcReceiveOptions = {
    isVrcDetected: boolean | null;
    socketConnected: boolean;
    // vrcParameter: VrcParameter;
    // lovenseStatus: LovenseStatus;
    // updateData: UpdateData;
};
