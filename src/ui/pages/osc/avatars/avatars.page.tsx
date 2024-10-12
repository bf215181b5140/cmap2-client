import Avatar from './components/avatar.component';
import AvatarUploadForm from './components/avatarUploadForm.component';
import { Page } from '../../../components/page/page.component';
import Segment from '../../../components/segment/segment.component';
import { useParams } from 'react-router-dom';
import React, { useEffect, useReducer } from 'react';
import VrcOscAvatarsReducer from './avatars.reducer';
import AvatarMenu from './components/avatarsMenu/avatarsMenu.component';

export default function AvatarsPage() {

  const routeParams = useParams();
  const [avatars, avatarsDispatch] = useReducer(VrcOscAvatarsReducer, []);
  const activeAvatar = routeParams.avatarId ? avatars.find(a => a.id === routeParams.avatarId) : avatars.at(0);

  useEffect(() => {
    window.IPC.get('getAvatars').then(data => avatarsDispatch({ type: 'setAvatars', avatars: data }));
  }, []);

  return (<Page flexDirection={'row'}>

    <Segment segmentTitle={'Saved avatars'} width={'Third'}>
      <p>Import, view or edit your avatar information.</p>
      <p>This can help you keep track of parameters on your avatar, let you set up OSC interactions faster and help you come up with creative ways of
        interacting with VRChat.</p>
    </Segment>

    <Segment segmentTitle={'Upload OSC file'} width={'Half'}>
      <p>Upload your avatar file found in: C:\ Users \ [USER] \ AppData \ LocalLow \ VRChat \ VRChat \ OSC \ [USER] \ Avatars</p>
      <AvatarUploadForm avatars={avatars} avatarsDispatch={avatarsDispatch} />
    </Segment>

    {avatars.length > 0 && <AvatarMenu avatars={avatars} activeAvatar={activeAvatar} avatarsDispatch={avatarsDispatch} />}

    {activeAvatar && <Avatar avatar={activeAvatar} avatarsDispatch={avatarsDispatch} />}

  </Page>);
}
