import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter/rxjs';
import type { WindowSize } from '../../shared/enums/windowSize';
import { TrackedParametersDTO, VrcParameter } from 'cmap2-shared';
import { Message } from 'node-osc';
import type { WindowState } from '../../shared/enums/windowState';

type MessageEvents = {
  'window:state': (windowState: WindowState) => void;
  'window:size': (windowSize: WindowSize) => void;
  'osc:sendMessage': (oscMessage: Message) => void;
  'osc:message': (vrcParameter: VrcParameter) => void;
  'trackedParameters:parameter': (vrcParameter: VrcParameter) => void;
  'trackedParameters:parameters': (vrcParameters: VrcParameter[]) => void;
  'socket:sendParameter': (vrcParameter: VrcParameter) => void;
  'socket:sendParameters': (vrcParameters: VrcParameter[]) => void;
  'socket:deleteParameter': (path: string) => void;
  'socket:applyParameters': (callback: (parameters: VrcParameter[]) => void) => void;
  'socket:useCostParameter': (parameter: VrcParameter) => void;
  'vrcDetector:detection': (isVrcDetected: boolean | null) => void;
}

export const BRIDGE = new EventEmitter() as TypedEmitter<MessageEvents>;
