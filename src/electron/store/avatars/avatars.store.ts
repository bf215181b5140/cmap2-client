import CmapStore from '../cmapStore';
import { IPC } from '../../ipc/typedIpc.service';
import { AvatarStoreData, avatarStoreDefaults } from './avatars.model';

class AvatarsStore extends CmapStore<AvatarStoreData>{

    constructor() {
        super({
            name: 'avatars',
            defaults: avatarStoreDefaults
        });

        IPC.handle('getAvatars', async () => this.get('avatars'));
        IPC.on('saveAvatars', (data) => this.set('avatars', data));
    }
}

export const AVATARS = new AvatarsStore();
