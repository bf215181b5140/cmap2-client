import { PresetDTO, UploadedFileDTO } from 'cmap2-shared';

export type PresetsSectionEvents = {
  onFormChange: (preset: PresetDTO) => void;
  onImageChange: (image: UploadedFileDTO | null) => void;
  onSaved: (preset: PresetDTO) => void;
}
