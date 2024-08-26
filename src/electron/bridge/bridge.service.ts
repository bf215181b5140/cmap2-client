import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter/rxjs';
import { WindowSize, WindowState } from '../../shared/enums';

type MessageEvents = {
    setWindowState: (windowState: WindowState) => void;
    setWindowSize: (windowSize: WindowSize) => void;
    isVrcDetected: (isVrcDetected: boolean | null) => void;
}

export const BRIDGE = new EventEmitter() as TypedEmitter<MessageEvents>;
