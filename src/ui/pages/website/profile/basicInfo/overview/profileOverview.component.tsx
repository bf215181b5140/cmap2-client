import TierBadge from '../../../../../components/tierBadge/tierBadge.component';
import React from 'react';
import { ProfilePageDTO, UploadedFileDTO } from 'cmap2-shared';
import Segment from '../../../../../components/segment/segment.component';
import ProfilePicture from './components/profilePicture.component';

interface ProfileOverviewProps {
  profile: ProfilePageDTO;
  setImage: (file: UploadedFileDTO) => void;
}

export default function ProfileOverview({ profile, setImage }: ProfileOverviewProps) {

  return (<Segment segmentTitle={`Hello, ${profile.displayName}`} width={'Third'}>
    <ProfilePicture image={profile.image} setImage={setImage} />
    <h3>Account tier</h3>
    <TierBadge tier={profile.tier} />
  </Segment>);
}
