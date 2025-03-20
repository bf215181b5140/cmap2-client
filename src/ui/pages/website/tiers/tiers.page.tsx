import React, { useEffect, useState } from 'react';
import { GeneratedInviteKeyDTO, TierDTO, TiersPageSchema } from 'cmap-shared';
import Tiers from './tiers/tiers.component';
import GenerateInviteKey from './generateInviteKey/generateInviteKey.component';
import UseInviteKey from './useInviteKey/useInviteKey.component';
import useCmapFetch from '../../../hooks/cmapFetch.hook';
import { Page } from '../../../components/page/page.component';
import NoConnection from '../../../components/noConnection/noConnection.component';
import PageMenu from '../../../components/menu/pageMenu/pageMenu.component';

export default function TiersPage() {

  const { GET } = useCmapFetch();
  const [section, setSection] = useState<'tiers' | 'inviteKeys'>('tiers');
  const [tiers, setTiers] = useState<TierDTO[] | undefined>();
  const [clientTier, setClientTier] = useState<TierDTO | undefined>();
  const [generatedKeys, setGeneratedKeys] = useState<GeneratedInviteKeyDTO[] | undefined>();
  const [noConnection, setNoConnection] = useState<boolean>(false);

  const minRank = tiers?.reduce((val, tier) => Math.min(val, tier.rank), 999) || 1;

  function addGeneratedInviteKey(generatedInviteKey: GeneratedInviteKeyDTO) {
    setGeneratedKeys(state => {
      if (!state) return [generatedInviteKey];
      return [...state, generatedInviteKey];
    });
  }

  useEffect(() => {
    GET('tiers', TiersPageSchema, data => {
      setTiers(data.tiers);
      setClientTier(data.clientTier);
      setGeneratedKeys(data.generatedKeys);
    }, () => setNoConnection(true));
  }, []);

  if (noConnection) return <NoConnection />;

  if (!tiers || !clientTier || !generatedKeys) return;

  return (<Page flexDirection={'column'}>

    <PageMenu>
      <div onClick={() => setSection('tiers')} aria-current={section === 'tiers'}>Tiers</div>
      <div onClick={() => setSection('inviteKeys')} aria-current={section === 'inviteKeys'}>Invite keys</div>
    </PageMenu>

    {section === 'tiers' && <>
      <Tiers clientTier={clientTier} tiers={tiers} />
    </>}

    {section === 'inviteKeys' && <>
      <UseInviteKey setClientTier={setClientTier} />
      {minRank < clientTier.rank && <GenerateInviteKey tiers={tiers} clientTier={clientTier} generatedInviteKeys={generatedKeys} addGeneratedInviteKey={addGeneratedInviteKey} />}
    </>}

  </Page>);
}
