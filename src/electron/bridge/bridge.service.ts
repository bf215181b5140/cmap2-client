import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter/rxjs';
import { ToyCommand } from 'lovense';
import { VrcParameter } from 'cmap2-shared';

type MessageEvents = {
    vrcParameter: (command: VrcParameter) => void;
    toyCommand: (command: ToyCommand) => void;
}

export const BridgeService = new EventEmitter() as TypedEmitter<MessageEvents>;
