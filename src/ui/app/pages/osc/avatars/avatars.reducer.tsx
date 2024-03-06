import { VrcOscAvatar, VrcOscAvatarParameter } from '../../../../../shared/types/osc';

export type VrcOscAvatarsReducerAction = { type: 'setAvatars', avatars: VrcOscAvatar[] } |
    { type: 'addAvatar', avatar: VrcOscAvatar } |
    { type: 'removeAvatar', avatar: VrcOscAvatar } |
    { type: 'removeParameter', avatarId: string, parameter: VrcOscAvatarParameter };

export default function VrcOscAvatarsReducer(state: VrcOscAvatar[], action: VrcOscAvatarsReducerAction) {
    let newAvatars: VrcOscAvatar[];

    switch (action.type) {
        case 'setAvatars':
            return action.avatars;
        case 'addAvatar':
            let exists = false;
            newAvatars = state.map(avatar => {
                if (avatar.id === action.avatar.id) {
                    exists = true;
                    return {...action.avatar};
                }
                return avatar;
            });
            if (!exists) newAvatars.push(action.avatar);
            window.electronAPI.send('setVrcOscAvatars', newAvatars);
            return newAvatars;
        case 'removeAvatar':
            newAvatars = state.filter(avatar => avatar.id !== action.avatar.id);
            window.electronAPI.send('setVrcOscAvatars', newAvatars);
            return newAvatars;
        case 'removeParameter':
            newAvatars = state.map(avatar => {
                if (avatar.id === action.avatarId) {
                    avatar.parameters = avatar.parameters.filter(parameter => parameter.name !== action.parameter.name);
                }
                return avatar;
            })
            window.electronAPI.send('setVrcOscAvatars', newAvatars);
            return newAvatars;
        default:
            return state;
    }
}
