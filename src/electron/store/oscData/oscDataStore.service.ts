import Store from 'electron-store';
import oscDataDefaults from './defaults';
import { VrcOscAvatar, VrcOscAvatarParameter } from '../../../shared/types/osc';
import TypedIpcMain from '../../ipc/typedIpcMain';

export class OscDataStoreService {
    private store = new Store({
        name: 'oscData',
        defaults: oscDataDefaults
    });

    constructor() {
        TypedIpcMain.handle('getVrcOscAvatars', async () => this.getAvatars());
        TypedIpcMain.on('setVrcOscAvatars', (data) => this.setAvatars(data));
    }

    private getAvatars() {
        return this.store.get('avatars');
    }

    private setAvatars(data: VrcOscAvatar[]) {
        this.store.set('avatars', data);
    }

    private getParameters(avatarId: string) {
        return this.getAvatars().find(avatar => avatar.id === avatarId)?.parameters;
    }

    private setParameters(avatarId: string, data: VrcOscAvatarParameter[]) {
        const avatars = this.getAvatars();
        avatars.filter(avatar => avatar.id === avatarId).forEach(avatar => avatar.parameters = data);
        this.store.set('avatars', avatars);
    }
}
