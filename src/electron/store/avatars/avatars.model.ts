import { VrcOscAvatar } from '../../../shared/objects/vrcOscAvatar';

export interface AvatarStoreData {
    avatars: VrcOscAvatar[];
}

export const avatarStoreDefaults: AvatarStoreData = {
    avatars: []
}