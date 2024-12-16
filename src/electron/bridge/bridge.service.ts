import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter/rxjs';
import type { WindowSize } from '../../shared/enums/windowSize';
import { TrackedParametersDTO, VrcParameter } from 'cmap2-shared';
import { Message } from 'node-osc';
import type { WindowState } from '../../shared/enums/windowState';

type MessageEvents = {
  setWindowState: (windowState: WindowState) => void;
  setWindowSize: (windowSize: WindowSize) => void;
  isVrcDetected: (isVrcDetected: boolean | null) => void;
  sendOscMessage: (oscMessage: Message) => void;
  // OSC
  oscMessage: (vrcParameter: VrcParameter) => void;
  // Parameters
  vrcParameter: (vrcParameter: VrcParameter) => void;
  vrcParameters: (vrcParameters: VrcParameter[]) => void;
  // Socket
  sendSocketParameter: (vrcParameter: VrcParameter) => void;
  sendSocketParameters: (vrcParameters: VrcParameter[]) => void;
}

export const BRIDGE = new EventEmitter() as TypedEmitter<MessageEvents>;
