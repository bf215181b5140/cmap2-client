import { ReactProps } from 'cmap2-shared';
import { VrcOscAvatar } from '../../../../../../shared/types/osc';
import AvatarParameters from './avatarParameters.component';
import styled from 'styled-components';
import DeleteButton from '../../../../shared/components/deleteButton.component';
import { VrcOscAvatarsReducerAction } from '../avatars.reducer';
import { useEffect, useState } from 'react';
import ActionButton from '../../../../shared/components/actionButton.component';

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
                {inEdit && <DeleteButton keyword={'avatar'} onClick={deleteAvatar} />}
                <ActionButton action={() => setInEdit((state) => !state)}>{inEdit ? 'Cancel' : 'Edit'}</ActionButton>
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
