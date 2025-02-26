import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter/rxjs';
import type { WindowSize } from '../../shared/enums/windowSize';
import { DetectedGamesDTO, UsedAvatarButtonDTO, UsedParameterButtonDTO, UsedPresetButtonDTO, VrcParameter } from 'cmap2-shared';
import { Message } from 'node-osc';
import type { WindowState } from '../../shared/enums/windowState';

type MessageEvents = {
  'window:state': (windowState: WindowState) => void;
  'window:size': (windowSize: WindowSize) => void;
  'osc:sendMessage': (oscMessage: Message) => void;
  'osc:vrcParameter': (vrcParameter: VrcParameter) => void;
  'trackedParameters:vrcParameter': (vrcParameter: VrcParameter) => void;
  'trackedParameters:vrcParameters': (vrcParameters: VrcParameter[]) => void;
  'socket:applyParameters': (callback: (parameters: VrcParameter[]) => void) => void;
  'socket:usedParameterButton': (usedParameterButton: UsedParameterButtonDTO) => void;
  'socket:usedPresetButton': (usedPresetButton: UsedPresetButtonDTO) => void;
  'socket:usedAvatarButton': (usedAvatarButton: UsedAvatarButtonDTO) => void;
  'gameDetector:detectedGames': (isGameDetected: DetectedGamesDTO) => void;
}

export const BRIDGE = new EventEmitter() as TypedEmitter<MessageEvents>;
