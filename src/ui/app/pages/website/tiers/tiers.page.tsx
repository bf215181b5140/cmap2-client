import useCustomFetch from '../../../shared/hooks/customFetch.hook';
import { useEffect, useState } from 'react';
import { Tiers, TierDto, ClientTier } from 'cmap2-shared';
import { ContentBox, Content } from 'cmap2-shared/dist/react';
import styled from 'styled-components';
import Icon from 'cmap2-shared/src/react/components/icon.component';

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
                <Tier current={tier.tier === clientTier.tier}>
                    {tier.tier === clientTier.tier && <h3>current</h3>}
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

const Highlight = styled.span<{ color: string }>`
  color: ${props => props.color};
`;
