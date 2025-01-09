import { VrcOscAvatar } from '../../shared/objects/vrcOscAvatar';
import { VrcParameter } from 'cmap2-shared';
import { Notification } from '../../shared/objects/notification';
import { WindowState } from '../../shared/enums/windowState';
import { UpdateData } from '../updater/updater.model';
import { WindowSize } from '../../shared/enums/windowSize';
import { TrackedParameter } from '../trackedParameters/trackedParameters.model';

export type IpcGetOptions = {
  'socket:connection': boolean;
  'osc:activity': number | undefined;
  'trackedParameters:get': [string, TrackedParameter];
  'utility:fingerprint': string;
  // these stores should get reworked wihtout IPC calls
  getAvatars: VrcOscAvatar[];
  getNotifications: Notification[];
};

export type IpcSendOptions = {
  'window:state': WindowState;
  'window:size': WindowSize;
  'osc:sendParameter': VrcParameter;
  'trackedParameters:set': VrcParameter;
  'trackedParameters:delete': string;
  'socket:connect': undefined;
  'socket:disconnect': undefined;
  'vrcDetector:check': void;
  'updater:check': undefined;
  'updater:start': string;
  // these stores should get reworked wihtout IPC calls
  saveAvatars: VrcOscAvatar[];
  saveNotification: Notification;
  deleteNotification: Notification;
  clearNotifications: void;
};

export type IpcReceiveOptions = {
  'trackedParameters:parameter': VrcParameter;
  'trackedParameters:parameters': VrcParameter[];
  'socket:connection': boolean;
  'vrcDetector:detection': boolean | null;
  'updater:data': UpdateData;
};
