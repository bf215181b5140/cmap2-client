import Segment from '../../../../components/segment/segment.component';
import SegmentTable from '../../../../components/segment/segmentTable.component';
import { GeneratedAccountKeyDTO, GeneratedAccountKeySchema, TierDTO } from 'cmap2-shared';
import { SelectInputStyled } from '../../../../style/input.style';
import React, { useState } from 'react';
import IconButton from '../../../../components/buttons/iconButton.component';
import useCmapFetch from '../../../../hooks/cmapFetch.hook';

interface GenerateAccountKeyProps {
    tiers: TierDTO[];
    clientTier: TierDTO;
    generatedAccountKeys: GeneratedAccountKeyDTO[];
    addGeneratedAccountKey: (generatedAccountKey: GeneratedAccountKeyDTO) => void;
}

export default function GenerateAccountKey({ generatedAccountKeys, tiers, clientTier, addGeneratedAccountKey }: GenerateAccountKeyProps) {

    const { POST } = useCmapFetch();
    const [selectedTierId, setSelectedTierId] = useState<string>(tiers.at(0)?.id || '');

    function generateKey() {
        POST('tiers/generateAccountKey', { id: selectedTierId }, GeneratedAccountKeySchema, data => {
            addGeneratedAccountKey(data);
        })
    }

    return (<Segment segmentTitle={'Generated account keys'}>
        <SegmentTable>
            <thead>
            <tr>
                <th>Key</th>
                <th>Tier</th>
                <th>Used</th>
            </tr>
            </thead>
            <tbody>
            {generatedAccountKeys.length === 0 && <tr><td colSpan={3} style={{textAlign: 'center'}}>You haven't generated any keys yet :3</td></tr>}
            {generatedAccountKeys.map((key) => (
                <tr key={key.id}>
                    <td>{key.key}</td>
                    <td>{key.tier?.label}</td>
                    <td>{key.used}</td>
                </tr>
            ))}
            </tbody>
        </SegmentTable>
        <h2>Generate new key</h2>
        <SelectInputStyled value={selectedTierId} onChange={(event) => setSelectedTierId(event.target.value)}>
            {tiers.filter(tier => tier.rank < clientTier.rank).map((tier) => (<option value={tier.id} key={tier.id}>{tier.label}</option>))}
        </SelectInputStyled>
        <IconButton role={'add'} onClick={() => generateKey()} />
    </Segment>);
}