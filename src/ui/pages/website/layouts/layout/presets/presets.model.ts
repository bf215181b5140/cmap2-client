import { PresetButtonDTO, UploadedFileDTO } from 'cmap2-shared';

export type PresetsSectionEvents = {
  onFormChange: (preset: PresetButtonDTO) => void;
  onImageChange: (image: UploadedFileDTO | null) => void;
  onSaved: (preset: PresetButtonDTO) => void;
}
