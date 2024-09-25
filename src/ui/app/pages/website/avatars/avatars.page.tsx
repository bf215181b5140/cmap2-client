import useAvatarPage from './avatars.hook';
import ButtonComponent from './button/button.component';
import AvatarsMenu from './avatarsMenu/avatarsMenu.component';
import React, { useState } from 'react';
import AvatarSettings from './avatar/avatarSettings/avatarSettings.component';
import ControlParameters from './avatar/controlParameters/controlParameters.component';
import { LayoutDTO, LayoutWidth } from 'cmap2-shared';
import LayoutComponent from './avatar/layout/layout.component';
import StateBadges from './avatar/stateBadges/stateBadges.component';
import Content from '../../../shared/components/contentBox/content.component';
import useCmapFetch from '../../../shared/hooks/cmapFetch.hook';

export default function AvatarsPage() {

    const cmapFetch = useCmapFetch();
    const { avatars, avatarDataDispatch, selectedAvatar, selectedLayout, selectedButton, clientTier, clientButtonStyle, interactionKeys } = useAvatarPage();
    const [page, setPage] = useState<'settings' | 'layout'>('settings');
    const layouts = selectedAvatar?.layouts?.sort((a, b) => a.order - b.order) || [];

    // if it's new avatar (doesn't have id) then set page to settings
    if (!selectedAvatar?.id && page !== 'settings') setPage('settings');

    // still no data from fetch
    if (!clientTier || !clientButtonStyle || !interactionKeys) return null;

    // Button is selected, show only button component for editing button
    if (selectedAvatar && selectedLayout && selectedButton) {
        return (<ButtonComponent button={selectedButton} layout={selectedLayout} avatar={selectedAvatar} buttonStyle={clientButtonStyle}
                                 interactionKeys={interactionKeys} avatarDataDispatch={avatarDataDispatch} clientTier={clientTier} />);
    }

    // handle layout reordering
    function reorderLayouts(layout: LayoutDTO, change: number) {
        const oldPos = layout.order;
        const newPos = Math.min(Math.max(layout.order + change, 0), (layouts.length || 1) - 1);
        let newLayoutOrder: LayoutDTO[] = [];

        if (change < 0) {
            newLayoutOrder = layouts.map((l, index) => {
                if (l.id === layout.id) {
                    l.order = newPos;
                    return l;
                } else {
                    if (index >= newPos && index < oldPos) {
                        l.order = index + 1;
                    } else {
                        l.order = index;
                    }
                }
                return l;
            });
        } else if (change > 0) {
            newLayoutOrder = layouts.map((l, index) => {
                if (l.id === layout.id) {
                    l.order = newPos;
                    return l;
                } else {
                    if (l.order <= newPos && l.order > oldPos) {
                        l.order = index - 1;
                    } else {
                        l.order = index;
                    }
                }
                return l;
            });
        } else {
            return;
        }

        cmapFetch('layout/order', {
            method: 'POST',
            body: JSON.stringify(newLayoutOrder),
            headers: {
                'Content-Type': 'application/json'
            }
        }, (data, res) => {
            if (res.code === 200) {
                avatarDataDispatch({ type: 'setLayoutOrder', layouts: newLayoutOrder, avatarId: selectedAvatar?.id! });
            }
        });
    }

    // Show avatars page
    return (<Content flexDirection={'row'}>

        <AvatarsMenu page={page} setPage={setPage} avatars={avatars} selectedAvatar={selectedAvatar} clientTier={clientTier} />

        {selectedAvatar && (<>
            {page === 'settings' ? (<>
                <AvatarSettings selectedAvatar={selectedAvatar} avatarDataDispatch={avatarDataDispatch} canCreateCopy={!!selectedAvatar.layouts && selectedAvatar.layouts?.length < clientTier.layouts} />
                {selectedAvatar.id && (<>
                    <StateBadges selectedAvatar={selectedAvatar} clientTier={clientTier} avatarDataDispatch={avatarDataDispatch} />
                    <ControlParameters selectedAvatar={selectedAvatar} clientTier={clientTier} avatarDataDispatch={avatarDataDispatch} />
                </>)}
            </>) : (<>
                {selectedAvatar.id && layouts.map((layout: LayoutDTO, index: number) => (
                    <LayoutComponent layout={layout} avatar={selectedAvatar} order={index + 1} key={index} clientTier={clientTier}
                                     interactionKeys={interactionKeys} avatarDataDispatch={avatarDataDispatch} buttonStyle={clientButtonStyle}
                                     changeOrder={reorderLayouts} />))
                }
                {selectedAvatar.id && clientTier.layouts && (!selectedAvatar.layouts || selectedAvatar.layouts.length < clientTier.layouts) &&
                    <LayoutComponent layout={{
                        id: '',
                        label: '',
                        order: selectedAvatar.layouts?.length || 0,
                        width: LayoutWidth.None
                    }} avatar={selectedAvatar} order={(selectedAvatar.layouts?.length || 0) + 1} interactionKeys={interactionKeys}
                                     clientTier={clientTier} avatarDataDispatch={avatarDataDispatch} buttonStyle={clientButtonStyle} />
                }
            </>)}
        </>)}

    </Content>);
}
