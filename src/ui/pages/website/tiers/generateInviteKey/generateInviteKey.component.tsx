import Segment from '../../../../components/segment/segment.component';
import SegmentTable from '../../../../components/segment/segmentTable.component';
import { GeneratedInviteKeyDTO, GeneratedInviteKeySchema, TierDTO } from 'cmap2-shared';
import { SelectInputStyled } from '../../../../style/input.style';
import React, { useContext, useState } from 'react';
import IconButton from '../../../../components/buttons/iconButton.component';
import useCmapFetch from '../../../../hooks/cmapFetch.hook';
import { theme } from '../../../../style/theme';
import { ModalContext } from '../../../../components/context/modal.context';
import { useNotifications } from '../../../../hooks/useNotifications.hook';
import AddCounter from '../../../../components/addCounter/addCounter.component';

interface GenerateInviteKeyProps {
  tiers: TierDTO[];
  clientTier: TierDTO;
  generatedInviteKeys: GeneratedInviteKeyDTO[];
  addGeneratedInviteKey: (generatedInviteKey: GeneratedInviteKeyDTO) => void;
}

export default function GenerateInviteKey({ generatedInviteKeys, tiers, clientTier, addGeneratedInviteKey }: GenerateInviteKeyProps) {

  const { POST } = useCmapFetch();
  const { setModal } = useContext(ModalContext);
  const { addNotification } = useNotifications();
  const [selectedTierId, setSelectedTierId] = useState<string>(tiers.at(0)?.id || '');
  const canAddMore = generatedInviteKeys.length < clientTier.inviteKeys;

  function usedText(key: GeneratedInviteKeyDTO) {
    return key.used ? 'Used' : 'Available';
  }

  function usedColor(key: GeneratedInviteKeyDTO) {
    return key.used ? theme.colors.error : theme.colors.success;
  }

  function confirmGenerateKey() {
    setModal({
      title: 'Generate new invite key',
      message: `Are you sure you want to generate a new invite key of tier ${tiers.find(t => t.id === selectedTierId)?.label}?`,
      confirmValue: 'Generate',
      confirmFunction: () => generateKey()
    });
  }

  function generateKey() {
    POST('tiers/generateInviteKey', { id: selectedTierId }, GeneratedInviteKeySchema, data => {
      addGeneratedInviteKey(data);
      addNotification('success', 'New invite key has been generated successfully.');
    });
  }

  return (<Segment segmentTitle={'Generated invite keys'} infoContent={segmentInfo}>
    <SegmentTable>
      <thead>
      <tr>
        <th>Tier</th>
        <th>Key</th>
        <th>Availability</th>
      </tr>
      </thead>
      <tbody>
      {generatedInviteKeys.length === 0 && <tr>
        <td colSpan={3} style={{ textAlign: 'center' }}>You haven't generated any keys yet :3</td>
      </tr>}
      {generatedInviteKeys.map((key) => (
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
    <SelectInputStyled value={selectedTierId} disabled={!canAddMore} onChange={(event) => setSelectedTierId(event.target.value)} width={'150px'}>
      {tiers.filter(tier => tier.rank < clientTier.rank).map((tier) => (<option value={tier.id} key={tier.id}>{tier.label}</option>))}
    </SelectInputStyled>
    <IconButton role={'add'} tooltip={'Generate new key'} disabled={!canAddMore} onClick={() => confirmGenerateKey()} />
    <AddCounter canAddMore={canAddMore}>{generatedInviteKeys.length}/{clientTier.inviteKeys}</AddCounter>
  </Segment>);
}

const segmentInfo = <>
  <p>
    You may be eligable to generate invite keys to share with other people.
    <br />
    These can be used to either upgrade an existing account tier or used during registration at times when registration is only available for those who have an invite key.
  </p>
</>;
