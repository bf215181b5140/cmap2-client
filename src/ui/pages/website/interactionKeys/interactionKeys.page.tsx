import React, { useEffect, useState } from 'react';
import { Page } from '../../../components/page/page.component';
import InteractionKeysForm from './form/interactionKeysForm.component';
import NoConnection from '../../../components/noConnection/noConnection.component';
import useCmapFetch from '../../../hooks/cmapFetch.hook';
import { InteractionKeyDTO, ProfilePageDTO, ProfilePageSchema } from 'cmap2-shared';

export default function InteractionKeysPage() {

  const { GET } = useCmapFetch();
  const [profile, setProfile] = useState<ProfilePageDTO | undefined | null>();

  useEffect(() => {
    GET('profile', ProfilePageSchema, data => setProfile(data), () => setProfile(null));
  }, []);

  function setInteractionKeys(interactionKeys: InteractionKeyDTO[]) {
    setProfile(prevState => {
      if (!prevState) return undefined;
      return { ...prevState, interactionKeys: interactionKeys };
    });
  }

  if (profile === undefined) return;

  if (profile === null) return <NoConnection />;

  return (<Page>
      <InteractionKeysForm profile={profile} setInteractionKeys={setInteractionKeys} />
  </Page>);
}

