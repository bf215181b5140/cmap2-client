import { AvatarDTO, ButtonDTO, ControlParameterDTO, LayoutDTO, StateBadgeDTO, UploadedFileDTO } from 'cmap2-shared';

export type AvatarReducerAction = { type: 'setAvatars', avatars: AvatarDTO[] } |
    { type: 'addAvatar', avatar: AvatarDTO } |
    { type: 'editAvatar', avatar: AvatarDTO } |
    { type: 'removeAvatar', avatar: AvatarDTO } |
    { type: 'saveControlParameters', controlParameters: ControlParameterDTO[], avatarId: string } |
    { type: 'removeControlParameter', controlParameter: ControlParameterDTO, avatarId: string } |
    { type: 'saveStateBadges', stateBadges: StateBadgeDTO[], avatarId: string } |
    { type: 'removeStateBadge', stateBadge: StateBadgeDTO, avatarId: string } |
    { type: 'addLayout', layout: LayoutDTO, avatarId: string } |
    { type: 'editLayout', layout: LayoutDTO, avatarId: string } |
    { type: 'removeLayout', layout: LayoutDTO, avatarId: string } |
    { type: 'addButton', button: ButtonDTO, layoutId: string, avatarId: string } |
    { type: 'editButton', button: ButtonDTO, layoutId: string, avatarId: string } |
    { type: 'removeButton', button: ButtonDTO, layoutId: string, avatarId: string } |
    { type: 'changeButtonPicture', image: UploadedFileDTO | null, buttonId: string, layoutId: string, avatarId: string };

export default function avatarsReducer(state: AvatarDTO[], action: AvatarReducerAction) {
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
        case 'saveControlParameters':
            return state.map(avatar => {
                if (avatar.id === action.avatarId) avatar.controlParameters = action.controlParameters;
                return avatar;
            });
        case 'removeControlParameter':
            return state.map(avatar => {
                if (avatar.id === action.avatarId) avatar.controlParameters = avatar.controlParameters?.filter(cp => cp.id !== action.controlParameter.id);
                return avatar;
            });
        case 'saveStateBadges':
            return state.map(avatar => {
                if (avatar.id === action.avatarId) avatar.stateBadges = action.stateBadges;
                return avatar;
            });
        case 'removeStateBadge':
            return state.map(avatar => {
                if (avatar.id === action.avatarId) avatar.stateBadges = avatar.stateBadges?.filter(b => b.id !== action.stateBadge.id);
                return avatar;
            });
        case 'addLayout':
            return state.map(avatar => {
                if (avatar.id === action.avatarId) {
                    if (!avatar.layouts) avatar.layouts = [];
                    avatar.layouts.push(action.layout);
                }
                return avatar;
            });
        case 'editLayout':
            return state.map(avatar => {
                if (avatar.id === action.avatarId) {
                    avatar.layouts = avatar.layouts?.map(layout => {
                        if (layout.id === action.layout.id) return {...layout, ...action.layout};
                        return layout;
                    });
                }
                return avatar;
            });
        case 'removeLayout':
            return state.map(avatar => {
                if (avatar.id === action.avatarId) avatar.layouts = avatar.layouts?.filter(layout => layout.id !== action.layout.id);
                return avatar;
            });
        case 'addButton':
            return state.map(avatar => {
                if (avatar.id === action.avatarId && avatar.layouts) {
                    const tempLayout = avatar.layouts.find(layout => layout.id === action.layoutId);
                    if (tempLayout) {
                        if (!tempLayout.buttons) tempLayout.buttons = [];
                        tempLayout.buttons.push(action.button);
                    }
                }
                return avatar;
            });
        case 'editButton':
            return state.map(avatar => {
                if (avatar.id === action.avatarId) {
                    avatar.layouts = avatar.layouts?.map(layout => {
                        if (layout.id === action.layoutId) {
                            layout.buttons = layout.buttons?.map(button => {
                                if (button.id === action.button.id) return {...button, ...action.button, id: action.button.id!};
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
                    avatar.layouts = avatar.layouts?.map(layout => {
                        if (layout.id === action.layoutId) layout.buttons = layout.buttons?.filter(button => button.id !== action.button.id);
                        return layout;
                    });
                }
                return avatar;
            });
        case 'changeButtonPicture':
            return state.map(avatar => {
                if (avatar.id === action.avatarId) {
                    avatar.layouts = avatar.layouts?.map(layout => {
                        if (layout.id === action.layoutId) {
                            layout.buttons = layout.buttons?.map(button => {
                                if (button.id === action.buttonId) return {...button, image: action.image};
                                return button;
                            });
                        }
                        return layout;
                    });
                }
                return avatar;
            });
        default:
            return state;
    }
}
