import useCmapFetch from '../../../shared/hooks/cmapFetch.hook';
import { useEffect, useState } from 'react';
import { TiersDTO, TierDTO, TierType } from 'cmap2-shared';
import styled from 'styled-components';
import Icon from 'cmap2-shared/src/react/components/icon.component';
import Content from '../../../shared/components/contentBox/content.component';
import ContentBox from '../../../shared/components/contentBox/contentBox.component';

export default function TiersPage() {

    const customFetch = useCmapFetch();
    const [tiers, setTiers] = useState<TierDTO[] | null>(null);
    const [clientTier, setClientTier] = useState<TierDTO | null>(null);

    useEffect(() => {
        customFetch<TiersDTO>('tiers', {}, data => {
            if (data.tiers) setTiers(data.tiers);
            if (data.clientTier) setClientTier(data.clientTier);
        });
    }, []);

    return (<Content>
        <ContentBox loading={!tiers || !clientTier}>
            <TiersPageStyled>
                {(tiers && clientTier) && tiers.map(tier => (
                    <Tier current={tier.tier === clientTier.tier} key={tier.tier}>
                        {tier.tier === clientTier.tier && <h3>current</h3>}
                        <h2>
                            <Icon icon="ri-medal-fill" color={tier.color} />
                            {tier.tier}
                        </h2>
                        <p>Up to <Highlight color={tier.color}>{tier.avatars}</Highlight> avatars</p>
                        <p>Up to <Highlight color={tier.color}>{tier.layouts}</Highlight> button groups</p>
                        <p>Up to <Highlight color={tier.color}>{tier.buttons}</Highlight> buttons per group</p>
                        {tier.tier === TierType.Standard && <p>Unlock <Highlight color={tier.color}>more</Highlight> website backgrounds</p>}
                        {tier.tier === TierType.Premium && <p>Unlock <Highlight color={tier.color}>all</Highlight> website backgrounds</p>}
                        {tier.tier === TierType.Standard && <p>Unlock <Highlight color={tier.color}>more</Highlight> button styles</p>}
                        {tier.tier === TierType.Premium && <p>Unlock <Highlight color={tier.color}>all</Highlight> button styles</p>}
                    </Tier>
                ))}
            </TiersPageStyled>
        </ContentBox>
    </Content>);
}

const TiersPageStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
  text-align: center;
`;

const Tier = styled.div<{ current: boolean }>`
  padding: ${props => props.current ? '25px' : '15px'};
  margin: ${props => props.current ? '15px 10px' : '40px 0'};
  flex-basis: 28%;
  border: 2px solid ${props => props.current ? props.theme.colors.ui.element1 : props.theme.colors.ui.element2};
  border-radius: 1em;

  p {
    margin: 5px;
  }

  h2 {
    text-transform: capitalize;
  }
`;

const Highlight = styled.span<{ color?: string }>`
  color: ${props => props.color};
`;
