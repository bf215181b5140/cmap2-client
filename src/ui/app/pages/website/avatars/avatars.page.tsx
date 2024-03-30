import { Content } from 'cmap2-shared/dist/react';
import useAvatarPage from './avatars.hook';
import ButtonComponent from './button/button.component';
import AvatarsMenu from './avatarsMenu/avatarsMenu.component';
import AvatarComponent from './avatar/avatar.component';

export default function AvatarsPage() {

    const {avatars, avatarDataDispatch, selectedAvatar, selectedLayout, selectedButton, clientTier, clientButtonStyle, interactionKeys} = useAvatarPage();

    if (clientTier && clientButtonStyle && interactionKeys) {
        if (selectedAvatar && selectedLayout && selectedButton) {
            return (<ButtonComponent button={selectedButton} layout={selectedLayout} avatar={selectedAvatar} buttonStyle={clientButtonStyle}
                                     interactionKeys={interactionKeys} avatarDataDispatch={avatarDataDispatch} clientTier={clientTier} />);
        } else {
            return (<Content flexDirection={'row'}>
                <AvatarsMenu avatars={avatars} selectedAvatar={selectedAvatar} clientTier={clientTier} />
                {selectedAvatar && <AvatarComponent selectedAvatar={selectedAvatar} clientTier={clientTier} buttonStyle={clientButtonStyle}
                                                    interactionKeys={interactionKeys} avatarDataDispatch={avatarDataDispatch} />}
            </Content>);
        }
    } else {
        return <></>;
    }
}
