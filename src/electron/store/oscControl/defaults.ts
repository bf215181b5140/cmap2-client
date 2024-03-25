import { OscClockSettings, OscClockSettingsDefaults } from '../../osc/clock/types';

interface OscControlDefaultsType {
    clock: OscClockSettings
}

const oscControlDefaults: OscControlDefaultsType = {
    clock: OscClockSettingsDefaults,
};

export default oscControlDefaults;
