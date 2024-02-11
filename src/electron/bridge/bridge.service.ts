import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter/rxjs';
import { ToyCommand } from 'lovense';
import { VrcParameter } from 'cmap2-shared';
import { Settings } from '../../shared/types/settings';
import { ClientCredentials } from '../../shared/classes';

type MessageEvents = {
    vrcParameter: (parameter: VrcParameter) => void;
    toyCommand: (command: ToyCommand) => void;
    sendOscMessage: (parameter: VrcParameter) => void;
    settings: (settings: Settings) => void;
    clientCredentials: (clientCredentials: ClientCredentials) => void;
}

export const BridgeService = new EventEmitter() as TypedEmitter<MessageEvents>;
