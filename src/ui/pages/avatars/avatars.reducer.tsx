import { VrcOscAvatar } from '../../../shared/types/osc';

export type VrcOscAvatarsReducerAction = { type: 'setAvatars', avatars: VrcOscAvatar[] } |
    { type: 'addAvatar', avatar: VrcOscAvatar } |
    { type: 'editAvatar', avatar: VrcOscAvatar } |
    { type: 'removeAvatar', avatar: VrcOscAvatar };

export default function VrcOscAvatarsReducer(state: VrcOscAvatar[], action: VrcOscAvatarsReducerAction) {
    let newAvatars: VrcOscAvatar[];

    switch (action.type) {
        case 'setAvatars':
            return action.avatars;
        case 'addAvatar':
            newAvatars = [...state, action.avatar];
            window.electronAPI.send('setVrcOscAvatars', newAvatars);
            return newAvatars;
        case 'editAvatar':
            newAvatars = state.map(avatar => {
                if (avatar.id === action.avatar.id) return {...action.avatar};
                return avatar;
            });
            window.electronAPI.send('setVrcOscAvatars', newAvatars);
            return newAvatars;
        case 'removeAvatar':
            newAvatars = state.filter(avatar => avatar.id !== action.avatar.id);
            window.electronAPI.send('setVrcOscAvatars', newAvatars);
            return newAvatars;
        default:
            return state;
    }
}
