import { AppSettings, OscSettings, OscStateSettings, SocketParameterBlacklist, SocketSettings, VrcDetectorSettings } from '../../shared/objects/settings';
import { Credentials } from '../../shared/objects/credentials';
import { VrcOscAvatar } from '../../shared/objects/vrcOscAvatar';
import { ClientStateParametersDTO, VrcParameter } from 'cmap2-shared';
import { Notification } from '../../shared/objects/notification';
import { WindowState } from '../../shared/enums/windowState';

export type IpcGetOptions = {
    getAppVersion: string;
    getCredentials: Credentials;
    getAppSettings: AppSettings;
    getVrcDetectorSettings: VrcDetectorSettings;
    getOscSettings: OscSettings;
    getOscStateSettings: OscStateSettings;
    getSocketSettings: SocketSettings;
    getSocketConnected: boolean;
    getAvatars: VrcOscAvatar[];
    getLastOscActivity: number | undefined;
    getTrackedParameters: Map<string, boolean | number | string>;
    getFingerprint: string;
    getNotifications: Notification[];

    // getLovenseSettings: LovenseSettings;
    // getToyCommandParameters: ToyCommandParameter[];
    // getToyCommandOscMessages: ToyCommandOscMessage[];

};

export type IpcSendOptions = {
    setWindowState: WindowState;
    setCredentials: Credentials;
    saveAppSettings: AppSettings;
    saveVrcDetectorSettings: VrcDetectorSettings;
    saveOscSettings: OscSettings;
    saveOscStateSettings: OscStateSettings;
    saveSocketSettings: SocketSettings;
    saveSocketParameterBlacklist: SocketParameterBlacklist;
    checkIsVrcDetected: void;
    connectSocket: undefined;
    disconnectSocket: undefined;
    saveAvatars: VrcOscAvatar[];
    saveNotification: Notification;
    deleteNotification: Notification;
    clearNotifications: void;
    sendVrcParameter: VrcParameter;

    // setLovenseSettings: LovenseSettings;
    // getLovenseStatus: undefined;
    // lovenseConnect: undefined;
    // lovenseDisconnect: undefined;
    // sendLovenseToyCommand: ToyCommand;
    // setToyCommandParameters: ToyCommandParameter[];
    // setToyCommandOscMessages: ToyCommandOscMessage[];

    // setTrackedParameters: Map<string, boolean | number | string>;
    setTrackedParameter: VrcParameter;
    deleteTrackedParameter: string;

    // checkForUpdates: undefined;
    // startUpdate: string;
};

export type IpcReceiveOptions = {
    isVrcDetected: boolean | null;
    socketConnected: boolean;
    vrcParameter: VrcParameter;
    trackedParameters: ClientStateParametersDTO;

    // lovenseStatus: LovenseStatus;
    // updateData: UpdateData;
};
