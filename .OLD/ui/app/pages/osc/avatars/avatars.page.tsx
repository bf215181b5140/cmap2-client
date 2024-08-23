import AvatarsMenu from './components/avatarsMenu/avatarsMenu.component';
import Avatar from './components/avatar.component';
import useAvatarsPage from './avatars.hook';
import AvatarUploadForm from './components/avatarUploadForm.component';
import Content from '../../../shared/components/contentBox/content.component';
import ContentBox from '../../../shared/components/contentBox/contentBox.component';
import { ContentBoxWidth } from 'cmap2-shared';

export default function AvatarsPage() {

    const [avatars, avatarsDispatch, activeAvatar, setActiveAvatar] = useAvatarsPage();

    return (<Content flexDirection={'row'}>

        <ContentBox contentTitle={'Saved avatars'} flexBasis={ContentBoxWidth.Third}>
            <p>Import, view or edit your avatar information.</p>
            <p>This can help you keep track of parameters on your avatar, let you set up OSC interactions faster and help you come up with creative ways of
                interacting with VRChat.</p>
        </ContentBox>

        <ContentBox contentTitle={'Upload OSC file'} flexBasis={ContentBoxWidth.Half}>
            <p>Upload your avatar file found in: C:\ Users \ [USER] \ AppData \ LocalLow \ VRChat \ VRChat \ OSC \ [USER] \ Avatars</p>
            <AvatarUploadForm avatars={avatars} avatarsDispatch={avatarsDispatch} />
        </ContentBox>

        {avatars.length > 0 && <ContentBox flexBasis={ContentBoxWidth.Full}>
            <AvatarsMenu avatars={avatars} activeAvatar={activeAvatar} setActiveAvatar={setActiveAvatar} />
        </ContentBox>}

        {activeAvatar && <ContentBox flexBasis={ContentBoxWidth.Full}>
            <Avatar avatar={activeAvatar} avatarsDispatch={avatarsDispatch} />
        </ContentBox>}

    </Content>);
}
