import { AvatarDto, ButtonDto, LayoutDto } from 'cmap2-shared';

export type AvatarReducerAction = { type: 'setAvatars', avatars: AvatarDto[] } |
    { type: 'addAvatar', avatar: AvatarDto } |
    { type: 'editAvatar', avatar: AvatarDto } |
    { type: 'removeAvatar', avatar: AvatarDto } |
    { type: 'addLayout', layout: LayoutDto, avatarId: string } |
    { type: 'editLayout', layout: LayoutDto, avatarId: string } |
    { type: 'removeLayout', layout: LayoutDto, avatarId: string } |
    { type: 'addButton', button: ButtonDto, layoutId: string, avatarId: string } |
    { type: 'editButton', button: ButtonDto, layoutId: string, avatarId: string } |
    { type: 'removeButton', button: ButtonDto, layoutId: string, avatarId: string };

export default function avatarReducer(state: AvatarDto[], action: AvatarReducerAction) {
    switch (action.type) {
        case 'setAvatars':
            return action.avatars;
        case 'addAvatar':
            return [...state, action.avatar];
        case 'editAvatar':
            return state.map(avatar => {
                if (avatar.id === action.avatar.id) return {...avatar, ...action.avatar};
                return avatar;
            });
        case 'removeAvatar':
            return state.filter(avatar => avatar.id !== action.avatar.id);
        case 'addLayout':
            return state.map(avatar => {
                if (avatar.id === action.avatarId) avatar.layouts.push(action.layout);
                return avatar;
            });
        case 'editLayout':
            return state.map(avatar => {
                if (avatar.id === action.avatarId) {
                    avatar.layouts = avatar.layouts.map(layout => {
                        if (layout.id === action.layout.id) return {...layout, ...action.layout};
                        return layout;
                    });
                }
                return avatar;
            });
        case 'removeLayout':
            return state.map(avatar => {
                if (avatar.id === action.avatarId) avatar.layouts = avatar.layouts.filter(layout => layout.id !== action.layout.id);
                return avatar;
            });
        case 'addButton':
            return state.map(avatar => {
                if (avatar.id === action.avatarId) avatar.layouts.find(layout => layout.id === action.layoutId)?.buttons.push(action.button);
                return avatar;
            });
        case 'editButton':
            return state.map(avatar => {
                if (avatar.id === action.avatarId) {
                    avatar.layouts = avatar.layouts.map(layout => {
                        if (layout.id === action.layoutId) {
                            layout.buttons = layout.buttons.map(button => {
                                if (button.id === action.button.id) return {...button, ...action.button};
                                return button;
                            });
                        }
                        return layout;
                    });
                }
                return avatar;
            });
        case 'removeButton':
            return state.map(avatar => {
                if (avatar.id === action.avatarId) {
                    avatar.layouts = avatar.layouts.map(layout => {
                        if (layout.id === action.layoutId) layout.buttons = layout.buttons.filter(button => button.id !== action.button.id);
                        return layout;
                    });
                }
                return avatar;
            });
        default:
            return state;
    }
}
