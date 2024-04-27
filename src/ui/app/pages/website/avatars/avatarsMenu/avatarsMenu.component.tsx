import { AvatarDTO, ReactProps, TierDTO } from 'cmap2-shared';
import { useNavigate } from 'react-router-dom';
import { ContentBox } from 'cmap2-shared/dist/react';
import { ContentBoxWidth } from 'cmap2-shared/src';
import React, { Dispatch, SetStateAction } from 'react';
import ContentBoxMenuLink from '../../../../shared/components/contentBox/contentBoxMenu/contentBoxMenuLink.component';
import styled from 'styled-components';
import { ContentBoxMenuSelect } from '../../../../shared/components/contentBox/contentBoxMenu/contentBoxMenuSelect.component';
import IconButton from '../../../../shared/components/buttons/iconButton.component';

interface AvatarsMenuProps extends ReactProps {
    page: 'settings' | 'layout';
    setPage: Dispatch<SetStateAction<'settings' | 'layout'>>;
    avatars: AvatarDTO[];
    selectedAvatar: AvatarDTO | undefined;
    clientTier: TierDTO;
}

export default function AvatarsMenu({ page, setPage, avatars, selectedAvatar, clientTier }: AvatarsMenuProps) {

    const navigate = useNavigate();

    return (<ContentBox flexBasis={ContentBoxWidth.Full}>
        <AvatarsMenuStyled>

            {/* Avatar selector */}
            <ContentBoxMenuSelect onChange={(event) => navigate('/website/avatars/' + event.target.value)} value={selectedAvatar?.id}>
                {avatars.map(a => (<option value={a.id} key={a.id}>{a.label}</option>))}
                {!selectedAvatar?.id && <option value={''} key={'newAvatar'}>New avatar</option>}
            </ContentBoxMenuSelect>

            {/* Add new avatar */}
            {(clientTier?.avatars && avatars.length < clientTier.avatars) &&
                <CustomAddButton type={'add'} tooltip={'Add new avatar'} icon={'ri-user-add-line'} onClick={() => navigate('/website/avatars/new')}
                            disabled={!selectedAvatar?.id || avatars.length >= clientTier.avatars} />
            }

            <hr />

            <ContentBoxMenuLink onClick={() => setPage('settings')} isActive={page === 'settings'}>Settings</ContentBoxMenuLink>
            <ContentBoxMenuLink onClick={() => setPage('layout')} isActive={page === 'layout'} disabled={!selectedAvatar?.id}>Layout</ContentBoxMenuLink>

        </AvatarsMenuStyled>
    </ContentBox>);
}

const AvatarsMenuStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  margin: -5px;

  hr {
    border: 1px solid ${props => props.theme.colors.submenu.bg};
    margin: 5px 5px;
    padding: 0;
    height: 32px;
  }
`;

const CustomAddButton = styled(IconButton)`
  height: 42px;
  width: 42px;
  margin: 0;
`;
