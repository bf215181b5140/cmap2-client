import { io, Socket } from 'socket.io-client';
import { UsedAvatarButtonDTO, UsedParameterButtonDTO, UsedPresetButtonDTO, VrcParameter } from 'cmap2-shared';
import { WEBSITE_URL } from '../../shared/const';
import { BRIDGE } from '../bridge/bridge.service';
import { IPC } from '../ipc/typedIpc.service';
import { SETTINGS } from '../store/settings/settings.store';
import log from 'electron-log';

export class SocketController {
  private socket: Socket | undefined;
  private settings = SETTINGS.get('socket');
  private credentials = SETTINGS.get('credentials');
  private socketParameterBlacklist = new Set<string>(SETTINGS.get('socketParameterBlacklist'));

  constructor() {

    SETTINGS.onChange('socket', data => this.settings = data);
    SETTINGS.onChange('credentials', data => {
      this.credentials = data;
      // if were already connected or set to auto connect then (re)make the connection
      if (this.socket?.connected || this.settings.autoConnect) {
        this.connect();
      }
    });
    SETTINGS.onChange('socketParameterBlacklist', data => this.socketParameterBlacklist = new Set(data));

    IPC.on('socket:connect', () => this.connect());
    IPC.on('socket:disconnect', () => this.socket?.close());
    IPC.handle('socket:connection', async () => !!this.socket?.connected);

    BRIDGE.on('vrcDetector:detection', data => this.socket?.emit('isVrcDetected', data));
    BRIDGE.on('trackedParameters:vrcParameter', vrcParameter => this.onVrcParameter(vrcParameter));
    BRIDGE.on('trackedParameters:vrcParameters', vrcParameters => this.onVrcParameters(vrcParameters));

    if (this.settings.autoConnect) this.connect();
  }

  // (re)start socket connection
  private connect() {
    if (this.socket) this.socket.close();

    if (typeof this.credentials.apiToken !== 'string') return;

    this.socket = io(WEBSITE_URL + '/client', {
      query: {
        apiToken: this.credentials.apiToken
      },
      transports: ['websocket']
    });

    this.socket.on('joined', () => {
      log.info('Socket connected to server');
      IPC.emit('socket:connection', !!this.socket?.connected);
      BRIDGE.emit('socket:applyParameters', (parameters: VrcParameter[]) => this.socket?.emit('parameters', parameters));
    });

    this.socket.on('parameters', (callback: (parameters: VrcParameter[]) => void) => {
      BRIDGE.emit('socket:applyParameters', callback);
    });

    this.socket.on('error', (err: Error) => {
      log.error('Socket error:', err.message);
      IPC.emit('socket:connection', !!this.socket?.connected);
    });

    this.socket.on('disconnect', (reason: string) => {
      log.info('Socket disconnected from server, reason:', reason);
      IPC.emit('socket:connection', !!this.socket?.connected);
    });

    this.socket.on('usedButton', (usedButton: UsedParameterButtonDTO) => {
      BRIDGE.emit('socket:usedButton', usedButton);
    });

    this.socket.on('usedPreset', (usedPreset: UsedPresetButtonDTO) => {
      BRIDGE.emit('socket:usedPreset', usedPreset);
    });

    this.socket.on('usedAvatar', (usedAvatar: UsedAvatarButtonDTO) => {
      BRIDGE.emit('socket:usedAvatar', usedAvatar);
    });
  }

  onVrcParameter(vrcParameter: VrcParameter) {
    if (!this.socketParameterBlacklist.has(vrcParameter.path)) this.socket?.emit('parameter', vrcParameter);
  }

  onVrcParameters(vrcParameters: VrcParameter[]) {
    this.socket?.emit('parameters', vrcParameters.filter(p => !this.socketParameterBlacklist.has(p.path)));
  }
}
