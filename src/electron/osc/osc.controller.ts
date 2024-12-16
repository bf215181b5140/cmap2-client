import { IPC } from '../ipc/typedIpc.service';
import { BRIDGE } from '../bridge/bridge.service';
import { VrcParameter } from 'cmap2-shared';
import { ArgumentType, Client, Message, Server } from 'node-osc';
import { OscSettings } from '../../shared/objects/settings';
import { SETTINGS } from '../store/settings/settings.store';

// const ignoredOscParameters = ['/avatar/parameters/VelocityZ', '/avatar/parameters/VelocityY', '/avatar/parameters/VelocityX',
//                               '/avatar/parameters/InStation', '/avatar/parameters/Seated', '/avatar/parameters/Upright',
//                               '/avatar/parameters/AngularY', '/avatar/parameters/Grounded', '/avatar/parameters/Face',
//                               '/avatar/parameters/GestureRightWeight', '/avatar/parameters/GestureRight',
//                               '/avatar/parameters/GestureLeftWeight', '/avatar/parameters/GestureLeft', '/avatar/parameters/Voice',
//                               '/avatar/parameters/Viseme', '/avatar/parameters/VelocityMagnitude'];

const ignoredOscParameters = ['/avatar/parameters/VelocityZ', '/avatar/parameters/VelocityY', '/avatar/parameters/VelocityX',

                              '/avatar/parameters/AngularY',
                              '/avatar/parameters/GestureRightWeight',
                              '/avatar/parameters/GestureLeftWeight', '/avatar/parameters/Voice',
                              '/avatar/parameters/Viseme', '/avatar/parameters/VelocityMagnitude'];

export class OscController {
  private oscServer: Server | undefined;
  private oscClient: Client | undefined;

  private ignoredParameters: Set<string> = new Set(ignoredOscParameters);

  private lastActivity: number | undefined;

  constructor() {
    SETTINGS.onChange('osc', this.start)

    IPC.handle('getLastOscActivity', async () => this.lastActivity);

    BRIDGE.on('sendOscMessage', message => this.send(message));
    IPC.on('sendVrcParameter', data => this.send(new Message(data.path, data.value)));

    this.start(SETTINGS.get('osc'));
  }

  private start(settings: OscSettings) {
    if (this.oscServer) this.oscServer.close();
    if (this.oscClient) this.oscClient.close();

    this.oscClient = new Client(settings.ip, settings.inPort);
    this.oscServer = new Server(settings.outPort, settings.ip);

    this.oscServer.on('message', message => this.onOscMessage(message));
  }

  private onOscMessage(message: [string, ...ArgumentType[]]) {
    // track last message activity
    this.lastActivity = Date.now();

    const path = message[0];

    // filter ignored parameters
    if (this.ignoredParameters.has(path)) return;

    const value = this.valueFromArgumentType(message[1]);
    const vrcParameter: VrcParameter = { path, value };

    BRIDGE.emit('oscMessage', vrcParameter);
  }

  private send(message: Message) {
    if (this.oscClient) this.oscClient.send(message);
  }

  private valueFromArgumentType(arg: ArgumentType): boolean | number | string {
    if (typeof arg === 'number' || typeof arg === 'boolean' || typeof arg === 'string') {
      return arg;
    } else {
      return arg.value;
    }
  }
}
