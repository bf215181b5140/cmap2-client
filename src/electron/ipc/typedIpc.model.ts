import { WindowState } from '../../shared/enums';
import { AppSettings, OscSettings, SocketParameterBlacklist, SocketSettings, VrcDetectorSettings } from '../../shared/schemas/settings.schema';
import { Credentials } from '../../shared/types';
import { VrcOscAvatar } from '../../shared/schemas/avatars.schema';
import { VrcParameter } from 'cmap2-shared';

export type IpcGetOptions = {
    getAppVersion: string;
    getCredentials: Credentials;
    getAppSettings: AppSettings;
    getVrcDetectorSettings: VrcDetectorSettings;
    getOscSettings: OscSettings;
    getSocketSettings: SocketSettings;
    getSocketConnected: boolean;
    getAvatars: VrcOscAvatar[];
    getLastOscActivity: number | undefined;
    getTrackedParameters: Map<string, boolean | number | string>;

    // getLovenseSettings: LovenseSettings;
    // getToyCommandParameters: ToyCommandParameter[];
    // getToyCommandOscMessages: ToyCommandOscMessage[];

    // getFingerprint: string;
};

export type IpcSendOptions = {
    setWindowState: WindowState;
    setCredentials: Credentials;
    saveAppSettings: AppSettings;
    saveVrcDetectorSettings: VrcDetectorSettings;
    saveOscSettings: OscSettings;
    saveSocketSettings: SocketSettings;
    saveSocketParameterBlacklist: SocketParameterBlacklist;
    checkIsVrcDetected: void;
    connectSocket: undefined;
    disconnectSocket: undefined;
    saveAvatars: VrcOscAvatar[];

    // setLovenseSettings: LovenseSettings;
    // getLovenseStatus: undefined;
    // lovenseConnect: undefined;
    // lovenseDisconnect: undefined;
    // sendLovenseToyCommand: ToyCommand;
    // setToyCommandParameters: ToyCommandParameter[];
    // setToyCommandOscMessages: ToyCommandOscMessage[];

    // setTrackedParameters: Map<string, boolean | number | string>;
    // setTrackedParameter: ClientStateParamDTO;
    // deleteTrackedParameter: ClientStateParamDTO;

    // checkForUpdates: undefined;
    // startUpdate: string;
};

export type IpcReceiveOptions = {
    isVrcDetected: boolean | null;
    socketConnected: boolean;
    vrcParameter: VrcParameter;

    // lovenseStatus: LovenseStatus;
    // updateData: UpdateData;
};
