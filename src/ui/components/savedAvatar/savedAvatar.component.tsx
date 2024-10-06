import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { VrcOscAvatar } from '../../../shared/objects/vrcOscAvatar';
import { Link } from 'react-router-dom';

interface AvatarNameProps {
    avatarId: string | undefined;
}

export default function AvatarName({ avatarId }: AvatarNameProps) {

    const [knownAvatars, setKnownAvatars] = useState<VrcOscAvatar[]>([]);
    const avatar = knownAvatars.find(a => a.id === avatarId);

    useEffect(() => {
        window.IPC.get('getAvatars').then(data => {
            setKnownAvatars(data);
        });
    }, []);

    if (!avatarId) return;

    return (<AvatarNameStyled>
        <Link to={'/osc/avatars/' + avatar?.id} className={'avatarNameLink'}>
            <i className={'ri-contacts-book-fill'} />
            {avatar?.name || avatarId}
        </Link>
    </AvatarNameStyled>);
}

const AvatarNameStyled = styled.div`
    font-size: 18px;
    margin: 10px;

    i {
        font-size: 24px;
        margin-right: 7px;
    }
    
    a.avatarNameLink {
        font-weight: normal;
        color: ${props => props.theme.colors.font.text};
        
        :hover {
        color: ${props => props.theme.colors.font.textBright};
        }
    }
`;