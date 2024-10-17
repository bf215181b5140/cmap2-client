import { VrcOscAvatar } from '../../../../../../shared/objects/vrcOscAvatar';
import { useNavigate } from 'react-router-dom';
import IconButton from '../../../../../components/buttons/iconButton.component';
import React from 'react';
import styled from 'styled-components';
import { VrcOscAvatarsReducerAction } from '../../avatars.reducer';
import SectionMenu from '../../../../../components/menu/sectionMenu/sectionMenu.component';
import { SelectInputStyled } from '../../../../../components/input/input.style';

interface AvatarsMenuProps {
  avatars: VrcOscAvatar[];
  activeAvatar: VrcOscAvatar | undefined;
  avatarsDispatch: React.Dispatch<VrcOscAvatarsReducerAction>;
}

export default function AvatarMenu({ avatars, activeAvatar, avatarsDispatch }: AvatarsMenuProps) {

  const navigate = useNavigate();

  function deleteAvatar() {
    if (!activeAvatar) return;
    avatarsDispatch({ type: 'removeAvatar', avatar: activeAvatar });
    navigate('/osc/avatars/');
  }

  return (<SectionMenu>
    <div>
      <SelectInputStyled className={'SectionMenuLink'} onChange={(event) => navigate('/osc/avatars/' + event.target.value)} value={activeAvatar?.id}>
        {avatars.map(avatar => (<option value={avatar.id} key={avatar.id}>{avatar.name}</option>))}
      </SelectInputStyled>
    </div>
    <div>
      <CustomIconButton role={'delete'} size={'small'} deleteKeyword={'avatar "' + activeAvatar?.name + '"'} onClick={deleteAvatar} />
    </div>
  </SectionMenu>);
}

const PageMenuLeftBar = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
`;

const CustomIconButton = styled(IconButton)`
    margin: 0 6px;
`;
