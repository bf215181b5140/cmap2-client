import { ReactProps, SegmentWidth } from 'cmap2-shared';
import AvatarParameters from './avatarParameters.component';
import { VrcOscAvatarsReducerAction } from '../avatars.reducer';
import { VrcOscAvatar } from '../../../../../shared/schemas/avatars.schema';
import Segment from '../../../../components/segment/segment.component';

interface AvatarProps extends ReactProps {
    avatar: VrcOscAvatar;
    avatarsDispatch: React.Dispatch<VrcOscAvatarsReducerAction>;
}

export default function Avatar({ avatar, avatarsDispatch }: AvatarProps) {

    return (<Segment flexBasis={SegmentWidth.Full} segmentTitle={avatar.name}>
        <p><b>Avatar ID:</b> {avatar.id}</p>
        {avatar.parameters && <AvatarParameters avatarId={avatar.id} parameters={avatar.parameters} avatarsDispatch={avatarsDispatch} />}
    </Segment>);
}
