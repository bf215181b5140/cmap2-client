import TierBadge from '../../../../components/tierBadge/tierBadge.component';
import React, { useContext } from 'react';
import { ProfilePageDTO, UploadedFileDTO } from 'cmap-shared';
import Segment from '../../../../components/segment/segment.component';
import ProfilePicture from './components/profilePicture.component';
import TextButton from '../../../../components/buttons/textButton.component';
import styled from 'styled-components';
import { ModalContext } from '../../../../components/context/modal.context';
import DeleteProfileModal from './deleteProfileModal/deleteProfileModal.component';

interface ProfileOverviewProps {
  profile: ProfilePageDTO;
  setImage: (file: UploadedFileDTO) => void;
}

export default function ProfileOverview({ profile, setImage }: ProfileOverviewProps) {

  const { setModal } = useContext(ModalContext);

  function onShowDeleteModal() {
    setModal(<DeleteProfileModal />);
  }

  return (<Segment segmentTitle={`Hello, ${profile.displayName}`} width={'Third'}>
    <ProfilePicture image={profile.image} setImage={setImage} />
    <h3>Account tier</h3>
    <TierBadge tier={profile.tier} />
    <br />
    <h3>Account actions</h3>
    <DeleteButton text={'Delete account'} onClick={onShowDeleteModal} />
  </Segment>)
    ;
}

const DeleteButton = styled(TextButton)`
  background: #853737 !important;
  border-color: #984040 !important;

  :hover, &[data-active='true'] {
    background: #984040 !important;
    border-color: #ac4949 !important;
  }
`;