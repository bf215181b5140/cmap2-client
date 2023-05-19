import { AvatarDto } from 'cmap2-shared';
import useAvatarPage from './avatars.hook';
import ButtonComponent from './button/button.component';
import AvatarsMenu from "./avatarsMenu/avatarsMenu.component";
import Avatar from "./avatar/avatar.component";

export default function AvatarsPage() {

    const {avatars, avatarDataDispatch, selectedAvatar, selectedLayout, selectedButton, clientTier, clientButtonStyle} = useAvatarPage();

    if (selectedAvatar && selectedLayout && selectedButton) {
        return (<ButtonComponent button={selectedButton} layout={selectedLayout} avatar={selectedAvatar} buttonStyle={clientButtonStyle}
                                 avatarDataDispatch={avatarDataDispatch} />);
    }

    return (<>
        <AvatarsMenu avatars={avatars} selectedAvatar={selectedAvatar} clientTier={clientTier} />
        <Avatar selectedAvatar={selectedAvatar || new AvatarDto()} clientTier={clientTier} buttonStyle={clientButtonStyle} avatarDataDispatch={avatarDataDispatch} />
    </>);
}
