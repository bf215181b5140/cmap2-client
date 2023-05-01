import useCustomFetch from '../../shared/hooks/customFetch.hook';
import { useEffect, useState } from 'react';
import { Tiers, TierDto, ClientTier } from 'cmap2-shared';
import ContentBox from '../../shared/components/contentBox.component';
import styled from 'styled-components';
import Content from '../../shared/components/content.component';
import Icon from 'cmap2-shared/dist/components/icon.component';
import colors from 'cmap2-shared/src/colors.json';

export default function TiersPage() {

    const customFetch = useCustomFetch();
    const [tiers, setTiers] = useState<TierDto[] | null>(null);
    const [clientTier, setClientTier] = useState<TierDto | null>(null);

    useEffect(() => {
        customFetch<Tiers>('tiers').then(res => {
            if (res?.body) {
                setTiers(res.body.tiers);
                setClientTier(res.body.clientTier);
            }
        });
    }, []);

    return(<Content>
        <ContentBox loading={!tiers || !clientTier}>
        <TiersPageStyled>
            {(tiers && clientTier) && tiers.map(tier => (
                <Tier current={tier.id === clientTier.id}>
                    {tier.id === clientTier.id && <h3>current</h3>}
                    <h2>
                        <Icon icon='ri-medal-fill' color={tier.color} />
                        {tier.tier}
                    </h2>
                    <p>Up to <Highlight color={tier.color}>{tier.avatars}</Highlight> avatars</p>
                    <p>Up to <Highlight color={tier.color}>{tier.layouts}</Highlight> button groups</p>
                    <p>Up to <Highlight color={tier.color}>{tier.buttons}</Highlight> buttons per group</p>
                    {tier.tier === ClientTier.Standard && <p>Unlock <Highlight color={tier.color}>more</Highlight> website backgrounds</p>}
                    {tier.tier === ClientTier.Premium && <p>Unlock <Highlight color={tier.color}>all</Highlight> website backgrounds</p>}
                    {tier.tier === ClientTier.Standard && <p>Unlock <Highlight color={tier.color}>more</Highlight> button styles</p>}
                    {tier.tier === ClientTier.Premium && <p>Unlock <Highlight color={tier.color}>all</Highlight> button styles</p>}
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
  flex-basis: ${props => props.current ? '35%' : '25%'};
  border: 2px solid ${props => props.current ? colors['button-hover-border'] : colors['button-border']};
  border-radius: 1em;
  
  p {
    margin: 5px;
  }
  
  h2 {
    text-transform: capitalize;
  }
`;

const Highlight = styled.span<{ color: string }>`
  color: ${props => props.color};
`;
