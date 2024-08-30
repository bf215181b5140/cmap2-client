import { ReactProps } from 'cmap2-shared';
import styled from 'styled-components';
import { VrcOscAvatar } from '../../../../../../shared/schemas/avatars.schema';
import PageMenuLink from '../../../../../components/menu/pageMenu/pageMenuLink.component';
import { useNavigate } from 'react-router-dom';

interface AvatarsMenuProps extends ReactProps {
    avatars: VrcOscAvatar[];
    activeAvatar: VrcOscAvatar | undefined;
}

export default function AvatarMenu({ avatars, activeAvatar }: AvatarsMenuProps) {

    const navigate = useNavigate();

    function isActive(avatar: VrcOscAvatar): boolean {
        return !!activeAvatar && avatar.id === activeAvatar.id;
    }

    return (<AvatarsMenuStyled>
        {avatars.map(avatar => (<PageMenuLink onClick={() => navigate('/osc/avatars/' + avatar.id)} isActive={isActive(avatar)} key={avatar.id}>{avatar.name}</PageMenuLink>))}
    </AvatarsMenuStyled>);
}

const AvatarsMenuStyled = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    flex-wrap: wrap;
`;
