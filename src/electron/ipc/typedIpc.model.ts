import { AppSettings, OscSettings, TrackedParametersSettings, SocketParameterBlacklist, SocketSettings, VrcDetectorSettings } from '../../shared/objects/settings';
import { Credentials } from '../../shared/objects/credentials';
import { VrcOscAvatar } from '../../shared/objects/vrcOscAvatar';
import { TrackedParametersDTO, TrackedParametersMap, VrcParameter } from 'cmap2-shared';
import { Notification } from '../../shared/objects/notification';
import { WindowState } from '../../shared/enums/windowState';

export type IpcGetOptions = {
    getAppVersion: string;
    getCredentials: Credentials;
    getAppSettings: AppSettings;
    getVrcDetectorSettings: VrcDetectorSettings;
    getOscSettings: OscSettings;
    getTrackedParametersSettings: TrackedParametersSettings;
    getSocketSettings: SocketSettings;
    getSocketConnected: boolean;
    getAvatars: VrcOscAvatar[];
    getLastOscActivity: number | undefined;
    getTrackedParameters: TrackedParametersMap;
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
    saveTrackedParametersSettings: TrackedParametersSettings;
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
    trackedParameters: TrackedParametersDTO;

    // lovenseStatus: LovenseStatus;
    // updateData: UpdateData;
};
