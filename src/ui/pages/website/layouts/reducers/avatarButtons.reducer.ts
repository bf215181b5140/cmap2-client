import { AvatarButtonDTO, UploadedFileDTO } from 'cmap2-shared';

export type AvatarButtonsReducerAction =
  { type: 'setAvatarButtons', avatarButtons: AvatarButtonDTO[] } |
  { type: 'add', avatarButton: AvatarButtonDTO } |
  { type: 'edit', avatarButton: AvatarButtonDTO } |
  { type: 'remove', avatarButton: AvatarButtonDTO } |
  { type: 'setOrder', avatarButtons: AvatarButtonDTO[] } |
  { type: 'changePicture', avatarButtonId: string, image: UploadedFileDTO | null };

export default function avatarButtonsReducer(state: AvatarButtonDTO[], action: AvatarButtonsReducerAction) {
  switch (action.type) {
    case 'setAvatarButtons':
      return action.avatarButtons;
    case 'add':
      return [...state, action.avatarButton];
    case 'edit':
      return state.map(avatarButton => {
        if (avatarButton.id === action.avatarButton.id) return { ...avatarButton, ...action.avatarButton };
        return avatarButton;
      });
    case 'remove':
      return state.filter(avatarButton => avatarButton.id !== action.avatarButton.id);
    case 'setOrder':
      return action.avatarButtons;
    case 'changePicture':
      return state.map(avatarButton => {
        if (avatarButton.id === action.avatarButtonId) return { ...avatarButton, image: action.image };
        return avatarButton;
      });
    default:
      return state;
  }
}
