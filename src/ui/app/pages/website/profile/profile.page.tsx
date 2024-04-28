import React from 'react';
import useProlfilePage from './profile.hook';
import ButtonStylePicker from './buttonStylePicker/buttonStylePicker';
import BackgroundPicker from './backgroundPicker/backgroundPicker.component';
import ProfileForm from './form/profileForm.component';
import ProfileInfo from './info/profileInfo.component';
import InteractionKeys from './interactionKeys/interactionKeys.component';
import Content from '../../../shared/components/contentBox/content.component';
import ContentBox from '../../../shared/components/contentBox/contentBox.component';

export default function ProfilePage() {

    const { client, backgrounds, buttonStyles, setClientInfo, setClientPicture, setInteractionKeys, setClientBackground, setClientButtonStyle } = useProlfilePage();

    return (
        <Content>
            <ContentBox loading={!client} contentTitle={`Hello, ${client?.displayName}!`} flexGrow={2}>
                {client && <ProfileInfo client={client} setClientPicture={setClientPicture} />}
            </ContentBox>

            <ContentBox loading={!client} contentTitle={'Edit profile'} flexGrow={3}>
                {client && <ProfileForm client={client} setClientInfo={setClientInfo} />}
            </ContentBox>

            {client && <InteractionKeys client={client} interactionKeys={client.interactionKeys || []} setInteractionKeys={setInteractionKeys} />}

            <BackgroundPicker client={client} setFunction={setClientBackground} backgrounds={backgrounds} />
            <ButtonStylePicker client={client} setFunction={setClientButtonStyle} buttonStyles={buttonStyles} />
        </Content>
    );
}


