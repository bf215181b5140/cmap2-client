import { VrcParameter } from 'cmap-shared';

export interface TrackedParametersStoreData {
  parameters: VrcParameter[];
}

export const trackedParametersStoreDefaults: TrackedParametersStoreData = {
  parameters: []
};