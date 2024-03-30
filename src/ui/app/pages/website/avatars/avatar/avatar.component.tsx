import React from 'react';
import { AvatarDTO, ButtonStyleDTO, LayoutDTO, LayoutWidth, ReactProps, TierDTO } from 'cmap2-shared';
import { AvatarReducerAction } from '../avatars.reducer';
import LayoutComponent from './layout/layout.component';
import AvatarSettings from './avatarSettings/avatarSettings.component';
import ControlParameters from './controlParameters/controlParameters.component';
import { InteractionKeyDTO } from 'cmap2-shared/dist/types/InteractionKey';

interface AvatarComponentProps extends ReactProps {
    selectedAvatar: AvatarDTO;
    clientTier: TierDTO;
    buttonStyle: ButtonStyleDTO;
    interactionKeys: InteractionKeyDTO[];
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function AvatarComponent({selectedAvatar, clientTier, buttonStyle, interactionKeys, avatarDataDispatch}: AvatarComponentProps) {

    return (<>
        <AvatarSettings selectedAvatar={selectedAvatar} avatarDataDispatch={avatarDataDispatch} />
        {selectedAvatar.id && <ControlParameters selectedAvatar={selectedAvatar} clientTier={clientTier} avatarDataDispatch={avatarDataDispatch} />}
        <h1 style={{flexBasis: '100%'}}>Website buttons</h1>
        {selectedAvatar.id && selectedAvatar.layouts?.map((layout: LayoutDTO, index: number) => (
            <LayoutComponent layout={layout} avatar={selectedAvatar} order={index + 1} key={index} clientTier={clientTier}
                             interactionKeys={interactionKeys} avatarDataDispatch={avatarDataDispatch} buttonStyle={buttonStyle} />))
        }
        {selectedAvatar.id && clientTier.layouts && (!selectedAvatar.layouts || selectedAvatar.layouts.length < clientTier.layouts) &&
            <LayoutComponent layout={{
                id: '',
                label: '',
                order: 0,
                width: LayoutWidth.None
            }} avatar={selectedAvatar} order={(selectedAvatar.layouts?.length || 0) + 1} interactionKeys={interactionKeys}
                             clientTier={clientTier} avatarDataDispatch={avatarDataDispatch} buttonStyle={buttonStyle} />
        }
    </>);
}
