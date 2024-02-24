import { ReactProps } from 'cmap2-shared';
import { VrcOscAvatar } from '../../../../shared/types/osc';
import AvatarParameters from './avatarParameters.component';
import styled from 'styled-components';
import DeleteButton from '../../../shared/components/deleteButton.component';
import { VrcOscAvatarsReducerAction } from '../avatars.reducer';

interface AvatarProps extends ReactProps {
    avatar: VrcOscAvatar;
    avatarsDispatch: React.Dispatch<VrcOscAvatarsReducerAction>;
}

export default function Avatar({avatar, avatarsDispatch}: AvatarProps) {

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
                <DeleteButton keyword={'avatar'} onClick={deleteAvatar} />
            </div>
        </AvatarInfo>
        {avatar.parameters && <AvatarParameters parameters={avatar.parameters} />}
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
