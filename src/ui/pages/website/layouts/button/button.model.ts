import { ParameterButtonDTO, UploadedFileDTO } from 'cmap2-shared';

export type ButtonSectionEvents = {
  onFormChange: (button: ParameterButtonDTO) => void;
  onImageChange: (image: UploadedFileDTO | null) => void;
  onButtonSaved: (button: ParameterButtonDTO) => void;
}
