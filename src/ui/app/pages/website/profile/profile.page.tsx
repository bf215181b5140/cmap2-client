import React from 'react';
import useProlfilePage from './profile.hook';
import ButtonStylePicker from './buttonStylePicker/buttonStylePicker';
import BackgroundPicker from './backgroundPicker/backgroundPicker.component';
import ProfileForm from './form/profileForm.component';
import ProfileInfo from './info/profileInfo.component';
import Content from '../../../shared/components/contentBox/content.component';
import ContentBox from '../../../shared/components/contentBox/contentBox.component';

export default function ProfilePage() {

    const { client, backgrounds, buttonStyles, setClient, setClientPicture, setClientBackground, setClientButtonStyle } = useProlfilePage();

    return (
        <Content>
            <ContentBox loading={ !client } flexGrow={2} contentTitle={`Hello, ${client?.displayName}!`}>
                { client && <ProfileInfo client={ client } setClientPicture={ setClientPicture } /> }
            </ContentBox>

            <ContentBox loading={ !client } flexGrow={3} contentTitle={'Edit profile'}>
                { client && <ProfileForm client={ client } setClient={ setClient } /> }
            </ContentBox>

            <BackgroundPicker client={ client } setFunction={ setClientBackground } backgrounds={ backgrounds } />
            <ButtonStylePicker client={ client } setFunction={ setClientButtonStyle } buttonStyles={ buttonStyles } />
        </Content>
    );
}


