import { AvatarButtonDTO, UploadedFileDTO } from 'cmap-shared';

export type EditAvatarButtonEvents = {
  onFormChange: (avatarButton: AvatarButtonDTO) => void;
  onImageChange: (image: UploadedFileDTO | null) => void;
  onSaved: (avatarButton: AvatarButtonDTO) => void;
}
