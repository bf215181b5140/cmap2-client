import { OscClockSettings, OscClockSettingsDefaults } from '../../osc/clock/types';

type OscControlDefaultsType = {
    clock: OscClockSettings
}

const oscControlDefaults: OscControlDefaultsType = {
    clock: OscClockSettingsDefaults,
};

export default oscControlDefaults;
