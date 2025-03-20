import { PresetButtonDTO, UploadedFileDTO } from 'cmap-shared';

export type EditPresetButtonEvents = {
  onFormChange: (presetButton: PresetButtonDTO) => void;
  onImageChange: (image: UploadedFileDTO | null) => void;
  onSaved: (presetButton: PresetButtonDTO) => void;
}
