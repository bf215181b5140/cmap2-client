import { baseboard, system, uuid } from 'systeminformation';
import { createHash } from 'crypto';
import { IPC } from '../ipc/typedIpc.service';

export class UtilityController {

  constructor() {
    IPC.handle('getFingerprint', () => this.getFingerprint());
  }

  async getFingerprint(): Promise<string> {
    const { serial, uuid: systemUuid } = await system();
    const { hardware } = await uuid();
    const { serial: boardSerial } = await baseboard();

    const systemInfo = { serial, systemUuid, hardware, boardSerial };

    return createHash('sha256').update(Object.values(systemInfo).join(',')).digest('hex').toString();
  }
}