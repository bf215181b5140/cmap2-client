import { SidePanel, SidePanelButton } from "../../../../shared/components/sidePanel.component";
import { AvatarDto, ClientTier, ReactProps, TierDto } from "cmap2-shared";
import Icon from "cmap2-shared/src/react/components/icon.component";
import { useNavigate } from "react-router-dom";
import { ContentBox } from 'cmap2-shared/dist/react';
import ActionButton from '../../../../shared/components/actionButton.component';
import { ContentBoxWidth } from 'cmap2-shared/src';

interface AvatarsMenuProps extends ReactProps {
    avatars: AvatarDto[];
    selectedAvatar: AvatarDto | undefined;
    clientTier: TierDto;
}

export default function AvatarsMenu({avatars, selectedAvatar, clientTier}: AvatarsMenuProps) {

    const navigate = useNavigate();

    return(<ContentBox flexBasis={ContentBoxWidth.Full}>
            {avatars && avatars.map((avatar: AvatarDto) => (
                <ActionButton action={() => navigate('/website/avatars/' + avatar.id)} key={avatar.id}>{avatar.label}</ActionButton>
            ))}
            {(clientTier?.avatars && avatars.length < clientTier.avatars) &&
                <ActionButton action={() => navigate('/website/avatars/new')} >New avatar</ActionButton>
            }
        </ContentBox>)

    // return(<SidePanel title={'Avatars'} icon={'ri-contacts-book-fill'}>
    //         {avatars && avatars.map((avatar: AvatarDto) => (
    //             <SidePanelButton active={selectedAvatar && selectedAvatar.id === avatar.id} onClick={() => navigate('/website/avatars/' + avatar.id)}
    //                              key={avatar.id}>{avatar.label}</SidePanelButton>
    //         ))}
    //         {(clientTier?.avatars && avatars.length < clientTier.avatars) &&
    //             <SidePanelButton className={'addButton'} onClick={() => navigate('/website/avatars/new')}
    //                              active={selectedAvatar && selectedAvatar.id === null}>
    //                 <Icon icon='ri-add-fill' />
    //             </SidePanelButton>}
    //     </SidePanel>)
}
