import Segment from '../../../../components/segment/segment.component';
import SegmentTable from '../../../../components/segment/segmentTable.component';
import { GeneratedAccountKeyDTO, GeneratedAccountKeySchema, TierDTO } from 'cmap2-shared';
import { SelectInputStyled } from '../../../../style/input.style';
import React, { useContext, useState } from 'react';
import IconButton from '../../../../components/buttons/iconButton.component';
import useCmapFetch from '../../../../hooks/cmapFetch.hook';
import { theme } from '../../../../style/theme';
import { ModalContext } from '../../../../components/context/modal.context';
import { useNotifications } from '../../../../hooks/useNotifications.hook';

interface GenerateAccountKeyProps {
    tiers: TierDTO[];
    clientTier: TierDTO;
    generatedAccountKeys: GeneratedAccountKeyDTO[];
    addGeneratedAccountKey: (generatedAccountKey: GeneratedAccountKeyDTO) => void;
}

export default function GenerateAccountKey({ generatedAccountKeys, tiers, clientTier, addGeneratedAccountKey }: GenerateAccountKeyProps) {

    const { POST } = useCmapFetch();
    const { setModal } = useContext(ModalContext);
    const { addNotification } = useNotifications();
    const [selectedTierId, setSelectedTierId] = useState<string>(tiers.at(0)?.id || '');

    function usedText(key: GeneratedAccountKeyDTO) {
        return key.used ? 'Used' : 'Available';
    }

    function usedColor(key: GeneratedAccountKeyDTO) {
        return key.used ? theme.colors.error : theme.colors.success;
    }

    function confirmGenerateKey() {
        setModal({
            title: 'Generate new account key',
            message: `Are you sure you want to generate a new account key of tier ${tiers.find(t => t.id === selectedTierId)?.label}?`,
            confirmValue: 'Generate',
            confirmFunction: () => generateKey()
        })
    }

    function generateKey() {
        POST('tiers/generateAccountKey', { id: selectedTierId }, GeneratedAccountKeySchema, data => {
            addGeneratedAccountKey(data);
            addNotification('success', 'New account key has been generated successfully.');
        });
    }

    return (<Segment segmentTitle={'Generated account keys'} infoContent={segmentInfo}>
        <SegmentTable>
            <thead>
            <tr>
                <th>Tier</th>
                <th>Key</th>
                <th>Availability</th>
            </tr>
            </thead>
            <tbody>
            {generatedAccountKeys.length === 0 && <tr>
                <td colSpan={3} style={{ textAlign: 'center' }}>You haven't generated any keys yet :3</td>
            </tr>}
            {generatedAccountKeys.map((key) => (
                <tr key={key.id}>
                    <td style={{ width: '140px' }}>
                        <i className={'ri-medal-fill'} style={{ color: key.tier.color }} />
                        {key.tier.label}
                    </td>
                    <td style={{ width: '280px' }}>{key.key}</td>
                    <td style={{ color: usedColor(key) }}>{usedText(key)}</td>
                </tr>
            ))}
            </tbody>
        </SegmentTable>
        <h2>Generate new key</h2>
        <SelectInputStyled value={selectedTierId} onChange={(event) => setSelectedTierId(event.target.value)} width={'150px'}>
            {tiers.filter(tier => tier.rank < clientTier.rank).map((tier) => (<option value={tier.id} key={tier.id}>{tier.label}</option>))}
        </SelectInputStyled>
        <IconButton role={'add'} tooltip={'Generate new key'} onClick={() => confirmGenerateKey()} />
    </Segment>);
}

const segmentInfo = <>
    <p>
        You may be eligable to generate account keys to share with other people.
        <br />
        These can be used to either upgrade an existing account tier or used during registration at times when registration is only available for those who have an account key.
    </p>
</>;
