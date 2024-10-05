import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter/rxjs';
import { WindowSize } from '../../shared/enums/windowSize';
import { VrcParameter } from 'cmap2-shared';
import { Message } from 'node-osc';
import { WindowState } from '../../shared/enums/windowState';

type MessageEvents = {
    setWindowState: (windowState: WindowState) => void;
    setWindowSize: (windowSize: WindowSize) => void;
    isVrcDetected: (isVrcDetected: boolean | null) => void;
    vrcParameter: (vrcParameter: VrcParameter) => void;
    sendOscMessage: (oscMessage: Message) => void;
}

export const BRIDGE = new EventEmitter() as TypedEmitter<MessageEvents>;
