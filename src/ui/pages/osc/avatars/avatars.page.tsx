import AvatarsMenu from './components/avatarsMenu/avatarsMenu.component';
import Avatar from './components/avatar.component';
import AvatarUploadForm from './components/avatarUploadForm.component';
import { SegmentWidth } from 'cmap2-shared';
import { Page } from '../../../components/page/page.component';
import Segment from '../../../components/segment/segment.component';
import { useParams } from 'react-router-dom';
import { useEffect, useReducer } from 'react';
import VrcOscAvatarsReducer from './avatars.reducer';

export default function AvatarsPage() {

    const routeParams = useParams();
    const [avatars, avatarsDispatch] = useReducer(VrcOscAvatarsReducer, []);
    const activeAvatar = routeParams.avatarId ? avatars.find(a => a.id === routeParams.avatarId) : avatars.at(0);

    useEffect(() => {
        window.IPC.get('getAvatars').then(data => avatarsDispatch({ type: 'setAvatars', avatars: data }));
    }, []);

    return (<Page flexDirection={'row'}>

        <Segment segmentTitle={'Saved avatars'} flexBasis={SegmentWidth.Third}>
            <p>Import, view or edit your avatar information.</p>
            <p>This can help you keep track of parameters on your avatar, let you set up OSC interactions faster and help you come up with creative ways of
                interacting with VRChat.</p>
        </Segment>

        <Segment segmentTitle={'Upload OSC file'} flexBasis={SegmentWidth.Half}>
            <p>Upload your avatar file found in: C:\ Users \ [USER] \ AppData \ LocalLow \ VRChat \ VRChat \ OSC \ [USER] \ Avatars</p>
            <AvatarUploadForm avatars={avatars} avatarsDispatch={avatarsDispatch} />
        </Segment>

        {avatars.length > 0 && <Segment flexBasis={SegmentWidth.Full}>
            <AvatarsMenu avatars={avatars} activeAvatar={activeAvatar} />
        </Segment>}

        {activeAvatar && <Segment flexBasis={SegmentWidth.Full}>
            <Avatar avatar={activeAvatar} avatarsDispatch={avatarsDispatch} />
        </Segment>}

    </Page>);
}
