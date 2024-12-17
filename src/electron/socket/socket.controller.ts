import { io, Socket } from 'socket.io-client';
import { VrcParameter } from 'cmap2-shared';
import { WEBSITE_URL } from '../../shared/const';
import { BRIDGE } from '../bridge/bridge.service';
import { Message } from 'node-osc';
import { IPC } from '../ipc/typedIpc.service';
import { Credentials } from '../../shared/objects/credentials';
import { SETTINGS } from '../store/settings/settings.store';
import log from 'electron-log';
import { SocketSettings } from '../../shared/objects/settings';

export class SocketController {
  private socket: Socket | undefined;
  private settings: SocketSettings;
  private credentials: Credentials;

  constructor() {
    this.settings = SETTINGS.get('socket');
    this.credentials = SETTINGS.get('credentials');

    SETTINGS.onChange('socket', data => this.settings = data);
    SETTINGS.onChange('credentials', data => {
      this.credentials = data;
      // if were already connected or set to auto connect then (re)make the connection
      if (this.socket?.connected || this.settings.autoConnect) {
        this.connect();
      }
    });

    IPC.on('socket:connect', () => this.connect());
    IPC.on('socket:disconnect', () => this.socket?.close());
    IPC.handle('socket:connection', async () => !!this.socket?.connected);

    BRIDGE.on('vrcDetector:detection', data => this.sendData('vrcDetector:detection', data));
    BRIDGE.on('socket:sendParameter', data => this.sendData('parameter', data));
    BRIDGE.on('socket:sendParameters', data => this.sendData('parameters', data));

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
    });

    this.socket.on('error', (err: Error) => {
      log.error('Socket error:', err.message);
      IPC.emit('socket:connection', !!this.socket?.connected);
    });

    this.socket.on('disconnect', (reason: string) => {
      log.info('Socket disconnected from server, reason:', reason);
      IPC.emit('socket:connection', !!this.socket?.connected);
    });

    this.socket.on('parameter', (parameter: VrcParameter) => {
      BRIDGE.emit('osc:sendMessage', new Message(parameter.path, parameter.value));
    });
  }

  // private onVrcParameter(vrcParameter: VrcParameter) {
  //   if (this.parameterBlacklist.has(vrcParameter.path)) return;
  //
  //   if (this.parameterBulkQueue.has(vrcParameter.path)) {
  //     this.parameterBulkQueue.set(vrcParameter.path, vrcParameter.value);
  //   }
  //
  //   this.sendData('parameter', vrcParameter);
  // }
  //
  // private onVrcParameters(vrcParameters: VrcParameter[]) {
  //   const filteredParameters = vrcParameters.filter(p => !this.parameterBlacklist.has(p.path));
  //   this.sendData('parameters', filteredParameters);
  // }

  private sendData(event: string, data: any) {
    this.socket?.emit(event, data);
  }
}
