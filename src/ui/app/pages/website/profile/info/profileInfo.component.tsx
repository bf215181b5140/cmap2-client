import TierBadge from '../components/tierBadge.component';
import React from 'react';
import { ClientDTO, UploadedFileDTO } from 'cmap2-shared';
import ProfilePicture from './components/profilePicture.component';

interface ProfileInfoProps {
    client: ClientDTO;
    setClientPicture: (file: UploadedFileDTO) => void;
}

export default function ProfileInfo({ client, setClientPicture }: ProfileInfoProps) {

    return (<>
        <h2>Hello, {client.displayName}!</h2>
        <ProfilePicture image={client.image} setClientPicture={setClientPicture} />
        <br />
        <h3>Account tier</h3>
        <TierBadge tier={client.tier} />
    </>);
}
