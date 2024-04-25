import { VrcOscAvatar } from '../../../../../../../shared/types/osc';
import { ReactProps } from 'cmap2-shared';
import styled from 'styled-components';
import ContentBoxMenuLink from '../../../../../shared/components/contentBoxMenu/contentBoxMenuLink.component';

interface AvatarsMenuProps extends ReactProps {
    avatars: VrcOscAvatar[];
    activeAvatar: VrcOscAvatar | undefined;
    setActiveAvatar: React.Dispatch<React.SetStateAction<VrcOscAvatar | undefined>>;
}

export default function AvatarMenu({avatars, activeAvatar, setActiveAvatar}: AvatarsMenuProps) {

    function setActive(avatar: VrcOscAvatar) {
        setActiveAvatar(avatar);
    }

    function isActive(avatar: VrcOscAvatar): boolean {
        return !!activeAvatar && avatar.id === activeAvatar.id;
    }

    return (<AvatarsMenuStyled>
        {avatars.map(avatar => (<ContentBoxMenuLink onClick={() => setActive(avatar)} isActive={isActive(avatar)} key={avatar.id}>{avatar.name}</ContentBoxMenuLink>))}
    </AvatarsMenuStyled>);
}

const AvatarsMenuStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-wrap: wrap;
`;
