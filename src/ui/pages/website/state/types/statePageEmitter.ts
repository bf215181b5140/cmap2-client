import { ClientStateParameterFormDTO, VrcParameter } from 'cmap2-shared';

export type StatePageEmitter = {
    selectParameter: (parameter: VrcParameter) => void;
    saveParameter: (parameter: ClientStateParameterFormDTO) => void;
    deleteParameter: (path: string) => void;
}
