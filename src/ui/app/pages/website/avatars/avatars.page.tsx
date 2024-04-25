import { Content } from 'cmap2-shared/dist/react';
import useAvatarPage from './avatars.hook';
import ButtonComponent from './button/button.component';
import AvatarsMenu from './avatarsMenu/avatarsMenu.component';
import React, { useState } from 'react';
import AvatarSettings from './avatar/avatarSettings/avatarSettings.component';
import ControlParameters from './avatar/controlParameters/controlParameters.component';
import { LayoutDTO, LayoutWidth } from 'cmap2-shared';
import LayoutComponent from './avatar/layout/layout.component';
import StateBadges from './avatar/stateBadges/stateBadges.component';

export default function AvatarsPage() {

    const { avatars, avatarDataDispatch, selectedAvatar, selectedLayout, selectedButton, clientTier, clientButtonStyle, interactionKeys } = useAvatarPage();
    const [page, setPage] = useState<'settings' | 'layout'>('settings');

    // still no data from fetch
    if (!clientTier || !clientButtonStyle || !interactionKeys) return null;

    // Button is selected, show only button component for editing button
    if (selectedAvatar && selectedLayout && selectedButton) {
        return (<ButtonComponent button={selectedButton} layout={selectedLayout} avatar={selectedAvatar} buttonStyle={clientButtonStyle}
                                 interactionKeys={interactionKeys} avatarDataDispatch={avatarDataDispatch} clientTier={clientTier} />);
    }

    // Show avatars page
    return (<Content flexDirection={'row'}>

        <AvatarsMenu page={page} setPage={setPage} avatars={avatars} selectedAvatar={selectedAvatar} clientTier={clientTier} />

        {selectedAvatar && (<>
            {page === 'settings' ? (<>
                <AvatarSettings selectedAvatar={selectedAvatar} avatarDataDispatch={avatarDataDispatch} />
                {selectedAvatar.id && (<>
                    <StateBadges selectedAvatar={selectedAvatar} clientTier={clientTier} avatarDataDispatch={avatarDataDispatch} />
                    <ControlParameters selectedAvatar={selectedAvatar} clientTier={clientTier} avatarDataDispatch={avatarDataDispatch} />
                </>)}
            </>) : (<>
                {selectedAvatar.id && selectedAvatar.layouts?.map((layout: LayoutDTO, index: number) => (
                    <LayoutComponent layout={layout} avatar={selectedAvatar} order={index + 1} key={index} clientTier={clientTier}
                                     interactionKeys={interactionKeys} avatarDataDispatch={avatarDataDispatch} buttonStyle={clientButtonStyle} />))
                }
                {selectedAvatar.id && clientTier.layouts && (!selectedAvatar.layouts || selectedAvatar.layouts.length < clientTier.layouts) &&
                    <LayoutComponent layout={{
                        id: '',
                        label: '',
                        order: 0,
                        width: LayoutWidth.None
                    }} avatar={selectedAvatar} order={(selectedAvatar.layouts?.length || 0) + 1} interactionKeys={interactionKeys}
                                     clientTier={clientTier} avatarDataDispatch={avatarDataDispatch} buttonStyle={clientButtonStyle} />
                }
            </>)}
        </>)}

    </Content>);
}
