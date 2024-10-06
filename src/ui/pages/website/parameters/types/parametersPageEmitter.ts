import { VrcParameter } from 'cmap2-shared';

export type ParametersPageEmitter = {
    selectParameter: (parameter: VrcParameter) => void;
    saveParameter: (parameter: VrcParameter) => void;
    deleteParameter: (path: string) => void;
}
