import { ReactProps } from 'cmap2-shared';
import { VrcOscAvatar } from '../../../../../../shared/types/osc';
import AvatarParameters from './avatarParameters.component';
import styled from 'styled-components';
import { VrcOscAvatarsReducerAction } from '../avatars.reducer';
import { useEffect, useState } from 'react';
import IconButton from '../../../../shared/components/buttons/iconButton.component';

interface AvatarProps extends ReactProps {
    avatar: VrcOscAvatar;
    avatarsDispatch: React.Dispatch<VrcOscAvatarsReducerAction>;
}

export default function Avatar({avatar, avatarsDispatch}: AvatarProps) {

    const [inEdit, setInEdit] = useState<boolean>(false);

    useEffect(() => {
        setInEdit(false);
    }, [avatar]);

    function deleteAvatar() {
        avatarsDispatch({type: 'removeAvatar', avatar: avatar});
    }

    return (<>
        <AvatarInfo>
            <div>
                <h2>{avatar.name}</h2>
                {avatar.id}
            </div>
            <div>
                {inEdit && <IconButton role={'delete'} size={'small'} deleteKeyword={'avatar'} onClick={deleteAvatar} />}
                <IconButton role={'edit'} onClick={() => setInEdit((state) => !state)} />
            </div>
        </AvatarInfo>
        {avatar.parameters && <AvatarParameters avatarId={avatar.id} parameters={avatar.parameters} avatarsDispatch={avatarsDispatch} inEdit={inEdit}/>}
    </>);
}

const AvatarInfo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
  justify-content: space-between;

  h2 {
    margin-top: 0;
  }
`;
