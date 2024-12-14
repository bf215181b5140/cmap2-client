import React, { useEffect, useState } from 'react';
import { Page } from '../../../components/page/page.component';
import ProfileOverview from './overview/profileOverview.component';
import NoConnection from '../../../components/noConnection/noConnection.component';
import useCmapFetch from '../../../hooks/cmapFetch.hook';
import { ProfileFormDTO, ProfilePageDTO, ProfilePageSchema, UploadedFileDTO } from 'cmap2-shared';
import ProfileForm from './form/profileForm.component';

export default function ProfilePage() {

  const { GET } = useCmapFetch();
  const [profile, setProfile] = useState<ProfilePageDTO | undefined | null>();

  useEffect(() => {
    GET('profile', ProfilePageSchema, data => setProfile(data), () => setProfile(null));
  }, []);

  function applyProfileForm(formData: ProfileFormDTO) {
    setProfile(prevState => {
      if (!prevState) return undefined;
      return { ...prevState, ...formData };
    });
  }

  function setImage(file: UploadedFileDTO) {
    setProfile(prevState => {
      if (!prevState) return undefined;
      return { ...prevState, image: file };
    });
  }

  if (profile === undefined) return;

  if (profile === null) return <NoConnection />;

  return (<Page>
      <ProfileOverview profile={profile} setImage={setImage} />
      <ProfileForm profile={profile} saveProfileForm={applyProfileForm} />
  </Page>);
}

