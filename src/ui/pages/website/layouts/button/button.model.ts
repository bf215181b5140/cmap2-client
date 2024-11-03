import { ButtonDTO, UploadedFileDTO } from 'cmap2-shared';

export type ButtonSectionEvents = {
  onFormChange: (button: ButtonDTO) => void;
  onImageChange: (image: UploadedFileDTO | null) => void;
  onButtonSaved: (button: ButtonDTO) => void;
}
