import { TierDTO } from 'cmap2-shared';
import Segment from '../../../../components/segment/segment.component';
import Icon from '../../../../components/icon/icon.component';
import styled from 'styled-components';

interface TiersProps {
  clientTier: TierDTO;
  tiers: TierDTO[];
}

export default function Tiers({ clientTier, tiers }: TiersProps) {

  const minRank = tiers.reduce((val, tier) => Math.min(val, tier.rank), 999);
  const maxRank = tiers.reduce((val, tier) => Math.max(val, tier.rank), 0);

  return (<Segment>
    <TiersStyled>
      {(tiers && clientTier) && tiers.map(tier => (
        <Tier current={tier.id === clientTier.id} key={tier.id}>
          {tier.id === clientTier.id && <h3>current</h3>}
          <h2>
            <Icon className="ri-medal-fill" color={tier.color} />
            {tier.label}
          </h2>
          <p><Highlight color={tier.color}>{tier.layouts}</Highlight> layouts</p>
          <p><Highlight color={tier.color}>{tier.layoutAvatars}</Highlight> avatars per layout</p>
          <p><Highlight color={tier.color}>{tier.parameterBadges}</Highlight> parameter badges</p>
          <p><Highlight color={tier.color}>{tier.groups}</Highlight> groups per layout</p>
          <p><Highlight color={tier.color}>{tier.parameterButtons}</Highlight> parameter buttons per group</p>
          <p>
            <Highlight color={tier.color}>{tier.presetButtons}</Highlight> presets
            and toggle up to <Highlight color={tier.color}>{tier.presetButtonParameters}</Highlight> parameters at once
          </p>
          <p><Highlight color={tier.color}>{tier.avatarButtons}</Highlight> avatar buttons</p>
          <p><Highlight color={tier.color}>{tier.interactionKeys}</Highlight> interaction keys</p>
          {tier.rank !== minRank && <p>
            <Highlight color={tier.color}>{tier.visibilityParameters}</Highlight> visibility
            and <Highlight color={tier.color}>{tier.callbackParameters}</Highlight> callback parameters
          </p>}
          {tier.rank !== minRank && <p>Create <Highlight color={tier.color}>{tier.inviteKeys}</Highlight> invite keys</p>}
          {tier.rank !== minRank && <p>Unlock <Highlight color={tier.color}>{tier.rank === maxRank ? 'all' : 'more'}</Highlight> website backgrounds</p>}
          {tier.rank !== minRank && <p>Unlock <Highlight color={tier.color}>{tier.rank === maxRank ? 'all' : 'more'}</Highlight> website styles</p>}
          {tier.useCost && <p>Unlock <Highlight color={tier.color}>cost system</Highlight> for buttons</p>}
          {tier.health && <p>Unlock <Highlight color={tier.color}>health display</Highlight> for avatars</p>}
          <br />
        </Tier>
      ))}
    </TiersStyled>
  </Segment>);
}

const TiersStyled = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: center;
    text-align: center;
`;

const Tier = styled.div<{ current: boolean }>`
    flex-grow: 1;
    padding: ${props => props.current ? '15px' : '10px'};
    margin: ${props => props.current ? '0' : '30px 0'};
    border: 2px solid ${props => props.current ? props.theme.colors.ui.element1 : props.theme.colors.ui.element2};
    border-radius: 12px;

    p {
        margin: 0;
    }

    h2 {
        text-transform: capitalize;
    }
`;

const Highlight = styled.span<{ color: string }>`
    color: ${props => props.color};
`;
