import CmapStore from '../cmapStore';
import { TrackedParametersStoreData, trackedParametersStoreDefaults } from './trackedParameters.model';

class TrackedParametersStore extends CmapStore<TrackedParametersStoreData> {

  constructor() {
    super({
      name: 'trackedParameters',
      defaults: trackedParametersStoreDefaults
    });
  }
}

export const TRACKED_PARAMETERS_STORE = new TrackedParametersStore();
