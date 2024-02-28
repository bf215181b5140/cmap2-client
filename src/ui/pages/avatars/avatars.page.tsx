import { Content, ContentBox } from 'cmap2-shared/dist/react';
import AvatarsMenu from './components/avatarsMenu/avatarsMenu.component';
import Avatar from './components/avatar.component';
import useAvatarsPage from './avatars.hook';
import AvatarUploadForm from './components/avatarUploadForm.component';
import { ContentBoxWidth } from 'cmap2-shared';

export default function AvatarsPage() {

    const [avatars, avatarsDispatch, activeAvatar, setActiveAvatar] = useAvatarsPage();

    return (<Content flexDirection={'row'}>

        <ContentBox flexBasis={ContentBoxWidth.Third}>
            <h2>Saved avatars</h2>
            <p>Import, view or edit your avatar information.</p>
            <p>This can help you keep track of parameters on your avatar, let you set up OSC interactions faster and help you come up with creative ways of
                interacting with Vrchat.</p>
        </ContentBox>

        <ContentBox flexBasis={ContentBoxWidth.Half}>
            <h2>Upload OSC file</h2>
            <p>Upload your avatar file found in: C:/Users/[USER]/AppData/LocalLow/Vrchat/OSC/Avatars</p>
            <AvatarUploadForm avatarsDispatch={avatarsDispatch} />
        </ContentBox>

        {avatars.length > 0 && <ContentBox flexBasis={ContentBoxWidth.Full}>
            <AvatarsMenu avatars={avatars} activeAvatar={activeAvatar} setActiveAvatar={setActiveAvatar} />
        </ContentBox>}

        {activeAvatar && <ContentBox flexBasis={ContentBoxWidth.Full}>
            <Avatar avatar={activeAvatar} avatarsDispatch={avatarsDispatch} />
        </ContentBox>}

    </Content>);
}
