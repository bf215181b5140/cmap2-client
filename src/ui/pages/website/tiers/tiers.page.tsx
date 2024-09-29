import { useEffect, useState } from 'react';
import { GeneratedAccountKeyDTO, TierDTO, TiersPageSchema } from 'cmap2-shared';
import { Page } from '../../../components/page/page.component';
import Tiers from './tiers/tiers.component';
import useCmapFetch from '../../../hooks/cmapFetch.hook';
import GenerateAccountKey from './generateAccountKey/generateAccountKey.component';
import UseAccountKey from './useAccountKey/useAccountKey.component';

export default function TiersPage() {

    const { GET } = useCmapFetch();
    const [tiers, setTiers] = useState<TierDTO[] | undefined>();
    const [clientTier, setClientTier] = useState<TierDTO | undefined>();
    const [generatedKeys, setGeneratedKeys] = useState<GeneratedAccountKeyDTO[] | undefined>();

    const minRank = tiers?.reduce((val, tier) => Math.min(val, tier.rank), 999) || 1;

    function addGeneratedAccountKey(generatedAccountKey: GeneratedAccountKeyDTO) {
        setGeneratedKeys(state => {
            if (!state) return [generatedAccountKey]
            return [...state, generatedAccountKey];
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
        <Tiers clientTier={clientTier} tiers={tiers} />
        {minRank < clientTier.rank && <GenerateAccountKey tiers={tiers} clientTier={clientTier} generatedAccountKeys={generatedKeys} addGeneratedAccountKey={addGeneratedAccountKey} />}
        <UseAccountKey />
    </Page>);
}
