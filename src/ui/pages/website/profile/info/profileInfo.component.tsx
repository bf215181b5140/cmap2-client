import TierBadge from '../components/tierBadge.component';
import React from 'react';
import { ClientDTO, UploadedFileDTO } from 'cmap2-shared';
import Segment from '../../../../components/segment/segment.component';
import ProfilePicture from './components/profilePicture.component';

interface ProfileInfoProps {
    client: ClientDTO;
    setClientPicture: (file: UploadedFileDTO) => void;
}

export default function ProfileInfo({ client, setClientPicture }: ProfileInfoProps) {

    return (<Segment segmentTitle={`Hello, ${client.displayName}`}>
        <ProfilePicture image={client.image} setClientPicture={setClientPicture} />
        <br />
        <h3>Account tier</h3>
        {client.tier && <TierBadge tier={client.tier} />}
    </Segment>);
}
