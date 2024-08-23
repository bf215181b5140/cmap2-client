import { baseboard, system, uuid } from 'systeminformation';
import { createHash } from 'crypto';

export async function getFingerprint(): Promise<string> {
    const {serial, uuid: systemUuid} = await system();
    const {hardware} = await uuid();
    const {serial: boardSerial} = await baseboard();

    const systemInfo = {serial, systemUuid, hardware, boardSerial};

    return createHash('sha256').update(Object.values(systemInfo).join(',')).digest('hex').toString();
}
