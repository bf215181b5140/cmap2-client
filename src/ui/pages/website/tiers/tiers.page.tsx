import React, { useEffect, useState } from 'react';
import { GeneratedInviteKeyDTO, TierDTO, TiersPageSchema } from 'cmap2-shared';
import { Page } from '../../../components/page/page.component';
import Tiers from './tiers/tiers.component';
import useCmapFetch from '../../../hooks/cmapFetch.hook';
import GenerateInviteKey from './generateInviteKey/generateInviteKey.component';
import UseInviteKey from './useInviteKey/useInviteKey.component';
import PageMenuLink from '../../../components/menu/pageMenu/pageMenuLink.component';
import PageMenu from '../../../components/menu/pageMenu/pageMenu.component';

type TiersPageSections = 'tiers' | 'inviteKeys';

export default function TiersPage() {

    const { GET } = useCmapFetch();
    const [section, setSection] = useState<TiersPageSections>('tiers');
    const [tiers, setTiers] = useState<TierDTO[] | undefined>();
    const [clientTier, setClientTier] = useState<TierDTO | undefined>();
    const [generatedKeys, setGeneratedKeys] = useState<GeneratedInviteKeyDTO[] | undefined>();

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
        });
    }, []);

    if (!tiers || !clientTier || !generatedKeys) return;

    return (<Page flexDirection={'column'}>

        <PageMenu noMarginTop={true}>
            <PageMenuLink onClick={() => setSection('tiers')} isActive={section === 'tiers'}>Tiers</PageMenuLink>
            <PageMenuLink onClick={() => setSection('inviteKeys')} isActive={section === 'inviteKeys'}>Invite keys</PageMenuLink>
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
