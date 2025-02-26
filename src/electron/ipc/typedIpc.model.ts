import { VrcOscAvatar } from '../../shared/objects/vrcOscAvatar';
import { VrcParameter } from 'cmap2-shared';
import { Notification } from '../../shared/objects/notification';
import { WindowState } from '../../shared/enums/windowState';
import { UpdateData } from '../updater/updater.model';
import { WindowSize } from '../../shared/enums/windowSize';
import { TrackedParameter, TrackedParameterDTO } from '../trackedParameters/trackedParameters.model';

export type IpcGetOptions = {
  'socket:connection': boolean;
  'osc:activity': number | undefined;
  'trackedParameters:getIgnoredParameters': string[];
  'trackedParameters:getTrackedParameters': [string, TrackedParameter][];
  'trackedParameters:getBufferFrequencyLimit': number;
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
  'osc:vrcParameter': VrcParameter;
  'trackedParameters:vrcParameter': VrcParameter;
  'trackedParameters:vrcParameters': VrcParameter[];
  'trackedParameters:trackedParameter': [string, TrackedParameter];
  'trackedParameters:trackedParameters': [string, TrackedParameter][];
  'socket:connection': boolean;
  'vrcDetector:detection': boolean | null;
  'updater:data': UpdateData;
};
