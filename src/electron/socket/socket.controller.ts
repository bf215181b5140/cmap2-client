import { io, Socket } from 'socket.io-client';
import { VrcParameter } from 'cmap2-shared';
import { WEBSITE_URL } from '../../shared/const';
import { BRIDGE } from '../bridge/bridge.service';
import { Message } from 'node-osc';
import { IPC } from '../ipc/typedIpc.service';
import { Credentials } from '../../shared/objects/credentials';
import { SETTINGS } from '../store/settings/settings.store';
import log from 'electron-log';

export class SocketController {
  private socket: Socket | undefined;
  private parameterBlacklist: Set<string> = new Set(SETTINGS.get('parameterBlacklist'));

  constructor() {
    IPC.on('setCredentials', (data) => {
      // if were already connected or set to auto connect then (re)make the connection
      if (this.socket?.connected || SETTINGS.get('socket').autoConnect) {
        this.connect(data);
      }
    });
    IPC.on('connectSocket', () => this.connect(SETTINGS.get('credentials')));
    IPC.on('disconnectSocket', () => this.socket?.close());
    IPC.handle('getSocketConnected', async () => !!this.socket?.connected);

    BRIDGE.on('isVrcDetected', data => this.sendData('isVrcDetected', data));
    BRIDGE.on('sendSocketParameter', data => this.sendData('parameter', data));
    BRIDGE.on('sendSocketParameters', data => this.sendData('parameters', data));
    // BRIDGE.on('vrcParameters', vrcParameters => this.onVrcParameters(vrcParameters));

    SETTINGS.onChange('socketParameterBlacklist', data => this.parameterBlacklist = new Set(data));

    if (SETTINGS.get('socket').autoConnect) this.connect(SETTINGS.get('credentials'));
  }

  // (re)start socket connection
  private connect(credentials: Credentials) {
    if (this.socket) this.socket.close();

    if (typeof credentials.apiToken !== 'string') return;

    this.socket = io(WEBSITE_URL + '/client', {
      query: {
        apiToken: credentials.apiToken
      },
      transports: ['websocket']
    });

    this.socket.on('joined', () => {
      log.info('Socket connected to server');
      IPC.emit('socketConnected', !!this.socket?.connected);
      // BRIDGE.emit('getOscActivity'); todo what's this
    });

    this.socket.on('error', (err: Error) => {
      log.error('Socket error:', err.message);
      IPC.emit('socketConnected', !!this.socket?.connected);
    });

    this.socket.on('disconnect', (reason: string) => {
      log.info('Socket disconnected from server, reason:', reason);
      IPC.emit('socketConnected', !!this.socket?.connected);
    });

    this.socket.on('parameter', (parameter: VrcParameter) => {
      BRIDGE.emit('sendOscMessage', new Message(parameter.path, parameter.value));
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
    console.log('socket sending:', event, data);
    this.socket?.emit(event, data);
  }
}
