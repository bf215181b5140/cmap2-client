import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter/rxjs';
import { VrcParameter } from 'cmap2-shared';
import { ClientCredentials } from '../../shared/classes';
import { Message } from 'node-osc';

type MessageEvents = {
    vrcParameter: (parameter: VrcParameter) => void;
    sendOscMessage: (parameter: Message) => void;
    clientCredentials: (clientCredentials: ClientCredentials) => void;
    getOscActivity: () => void;
    oscActivity: (isActive: boolean) => void;
    isVrchatRunning: (isVrchatRunning: boolean | null) => void;
}

export const BridgeService = new EventEmitter() as TypedEmitter<MessageEvents>;
