import React from 'react';
import useProlfilePage from './profile.hook';
import { Page } from '../../../components/page/page.component';
import ProfileInfo from './info/profileInfo.component';
import ProfileForm from './form/profileForm.component';

export default function ProfilePage() {

    const { client, setProfileInfo, setClientPicture, setInteractionKeys } = useProlfilePage();

    return (<Page flexDirection={'row'}>
            {/* <ContentBox loading={!client} contentTitle={`Hello, ${client?.displayName}!`} flexGrow={2}> */}
                {client && <ProfileInfo client={client} setClientPicture={setClientPicture} />}
            {/* </ContentBox> */}

            {/* <ContentBox loading={!client} contentTitle={'Edit profile'} flexGrow={3}> */}
                {client && <ProfileForm client={client} setProfileInfo={setProfileInfo} />}
            {/* </ContentBox> */}

            {/* {client && <InteractionKeys client={client} interactionKeys={client.interactionKeys || []} setInteractionKeys={setInteractionKeys} />} */}
        </Page>);
}


