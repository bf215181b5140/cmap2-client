import { IPC } from '../ipc/typedIpc.service';
import { BRIDGE } from '../bridge/bridge.service';
import { VrcParameter } from 'cmap2-shared';
import { ArgumentType, Client, Message, Server } from 'node-osc';
import { OscSettings } from '../../shared/objects/settings';
import { SETTINGS } from '../store/settings/settings.store';

export class OscController {
  private oscServer: Server | undefined;
  private oscClient: Client | undefined;

  private lastActivity: number | undefined;

  constructor() {
    SETTINGS.onChange('osc', this.start)

    IPC.handle('osc:activity', async () => this.lastActivity);

    BRIDGE.on('osc:sendMessage', message => this.send(message));
    IPC.on('osc:sendParameter', data => this.send(new Message(data.path, data.value)));

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

    const value = this.valueFromArgumentType(message[1]);
    const vrcParameter: VrcParameter = { path, value };

    BRIDGE.emit('osc:vrcParameter', vrcParameter);
    IPC.emit('osc:vrcParameter', vrcParameter);
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
