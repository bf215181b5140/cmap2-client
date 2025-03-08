import { VrcParameter } from 'cmap2-shared';

export interface TrackedParametersStoreData {
  parameters: VrcParameter[];
}

export const trackedParametersStoreDefaults: TrackedParametersStoreData = {
  parameters: []
};