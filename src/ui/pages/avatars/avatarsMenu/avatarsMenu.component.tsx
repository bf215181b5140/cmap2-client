import { SidePanel, SidePanelButton } from "../../../shared/components/sidePanel.component";
import { AvatarDto, ClientTier, ReactProps, TierDto } from "cmap2-shared";
import Icon from "cmap2-shared/dist/components/icon.component";
import { useNavigate } from "react-router-dom";

interface AvatarsMenuProps extends ReactProps {
    avatars: AvatarDto[];
    selectedAvatar: AvatarDto | undefined;
    clientTier: TierDto;
}

export default function AvatarsMenu({avatars, selectedAvatar, clientTier}: AvatarsMenuProps) {

    const navigate = useNavigate();

    return(<SidePanel title={'Avatars'} icon={'ri-contacts-book-fill'}>
            {avatars && avatars.map((avatar: AvatarDto) => (
                <SidePanelButton active={selectedAvatar && selectedAvatar.id === avatar.id} onClick={() => navigate('/avatars/' + avatar.id)}
                                 key={avatar.id}>{avatar.label}</SidePanelButton>
            ))}
            {(clientTier?.avatars && avatars.length < clientTier.avatars) &&
                <SidePanelButton className={'addButton'} onClick={() => navigate('/avatars/new')}
                                 active={selectedAvatar && selectedAvatar.id === null}>
                    <Icon icon='ri-add-fill' />
                </SidePanelButton>}
        </SidePanel>)
}
