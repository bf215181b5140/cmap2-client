import { AvatarDTO, ReactProps, TierDTO } from "cmap2-shared";
import { useNavigate } from "react-router-dom";
import { ContentBox } from 'cmap2-shared/dist/react';
import ActionButton from '../../../../shared/components/buttons/actionButton.component';
import { ContentBoxWidth } from 'cmap2-shared/src';

interface AvatarsMenuProps extends ReactProps {
    avatars: AvatarDTO[];
    selectedAvatar: AvatarDTO | undefined;
    clientTier: TierDTO;
}

export default function AvatarsMenu({avatars, selectedAvatar, clientTier}: AvatarsMenuProps) {

    const navigate = useNavigate();

    return(<ContentBox flexBasis={ContentBoxWidth.Full}>
            {avatars && avatars.map((avatar: AvatarDTO) => (
                <ActionButton action={() => navigate('/website/avatars/' + avatar.id)} key={avatar.id}>{avatar.label}</ActionButton>
            ))}
            {(clientTier?.avatars && avatars.length < clientTier.avatars) &&
                <ActionButton action={() => navigate('/website/avatars/new')} >New avatar</ActionButton>
            }
        </ContentBox>)
}
