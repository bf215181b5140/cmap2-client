import React from 'react';
import { AvatarDto, ButtonStyleDto, LayoutDto, ReactProps, TierDto } from 'cmap2-shared';
import { AvatarReducerAction } from '../avatars.reducer';
import UploadAvatar from './uploadAvatar/uploadAvatar.component';
import Parameters from './parameters/parameters.component';
import LayoutComponent from './layout/layout.component';
import AvatarSettings from './avatarSettings/avatarSettings.component';
import ControlParameters from './controlParameters/controlParameters.component';
import { EventBus } from '../../../shared/util/eventBus';
import { VRChatOscAvatar } from '../../../../shared/interfaces';

interface AvatarComponentProps extends ReactProps {
    selectedAvatar: AvatarDto;
    clientTier: TierDto;
    buttonStyle: ButtonStyleDto;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

const eventBus = new EventBus<VRChatOscAvatar>();

export default function AvatarComponent({selectedAvatar, clientTier, buttonStyle, avatarDataDispatch}: AvatarComponentProps) {

    return (<>
        <h1 style={{flexBasis: '100%'}}>Avatar settings</h1>
        <UploadAvatar eventBus={eventBus} />
        <AvatarSettings selectedAvatar={selectedAvatar} avatarDataDispatch={avatarDataDispatch} eventBus={eventBus} />
        {selectedAvatar.id && <Parameters selectedAvatar={selectedAvatar} avatarDataDispatch={avatarDataDispatch} eventBus={eventBus} />}
        {selectedAvatar.id && <ControlParameters selectedAvatar={selectedAvatar} clientTier={clientTier} avatarDataDispatch={avatarDataDispatch} />}
        <h1 style={{flexBasis: '100%'}}>Website buttons</h1>
        {selectedAvatar.id && selectedAvatar.layouts?.map((layout: LayoutDto, index: number) => (
            <LayoutComponent layout={layout} avatar={selectedAvatar} order={index + 1} key={index} clientTier={clientTier}
                             avatarDataDispatch={avatarDataDispatch} buttonStyle={buttonStyle} />))
        }
        {selectedAvatar.id && clientTier.layouts && (!selectedAvatar.layouts || selectedAvatar.layouts.length < clientTier.layouts) &&
            <LayoutComponent layout={new LayoutDto()} avatar={selectedAvatar} order={(selectedAvatar.layouts?.length || 0) + 1}
                             clientTier={clientTier} avatarDataDispatch={avatarDataDispatch} buttonStyle={buttonStyle} />
        }
    </>);
}
