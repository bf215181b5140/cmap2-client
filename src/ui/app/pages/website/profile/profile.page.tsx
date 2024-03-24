import { Content, ContentBox } from 'cmap2-shared/dist/react';
import React from 'react';
import useProlfilePage from './profile.hook';
import ButtonStylePicker from './buttonStylePicker/buttonStylePicker';
import BackgroundPicker from './backgroundPicker/backgroundPicker.component';
import ProfileForm from './form/profileForm.component';
import ProfileInfo from './info/profileInfo.component';

export default function ProfilePage() {

    const { client, backgrounds, buttonStyles, setClient, setClientPicture, setClientBackground, setClientButtonStyle } = useProlfilePage();

    return (
        <Content>
            <ContentBox loading={ !client } flexGrow={2}>
                { client && <ProfileInfo client={ client } setClientPicture={ setClientPicture } /> }
            </ContentBox>

            <ContentBox loading={ !client } flexGrow={3}>
                { client && <ProfileForm client={ client } setClient={ setClient } /> }
            </ContentBox>

            <BackgroundPicker client={ client } setFunction={ setClientBackground } backgrounds={ backgrounds } />
            <ButtonStylePicker client={ client } setFunction={ setClientButtonStyle } buttonStyles={ buttonStyles } />
        </Content>
    );
}


