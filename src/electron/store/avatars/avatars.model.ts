import { VrcOscAvatar } from '../../../shared/schemas/avatars.schema';

export interface AvatarStoreData {
    avatars: VrcOscAvatar[];
}

export const avatarStoreDefaults: AvatarStoreData = {
    avatars: []
}