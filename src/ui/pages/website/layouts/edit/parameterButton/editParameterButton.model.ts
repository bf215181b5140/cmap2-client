import { ParameterButtonDTO, UploadedFileDTO } from 'cmap-shared';

export type EditParameterButtonEvents = {
  onFormChange: (parameterButton: ParameterButtonDTO) => void;
  onImageChange: (image: UploadedFileDTO | null) => void;
  onSaved: (parameterButton: ParameterButtonDTO) => void;
}
