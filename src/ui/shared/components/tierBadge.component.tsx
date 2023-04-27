import { ReactProps } from '../../../shared/global';
import { ClientTier } from 'cmap2-shared';
import styled from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';
import Icon from 'cmap2-shared/dist/components/icon.component';

interface TierBadge extends ReactProps {
    tier: ClientTier;
}

export default function TierBadge({ tier }: TierBadge) {

    function color() {
        // @ts-ignore
        return colors['tier-' + tier] as string;
    }

    return(<TierBadgeStyled color={color()}>
        <Icon icon='ri-medal-fill' color={color()} />
        {Object.keys(ClientTier)[Object.values(ClientTier).indexOf(tier)]}
    </TierBadgeStyled>);
}

const TierBadgeStyled = styled.span<{ color: string }>`
  border: 1px solid ${props => props.color};
  border-radius: 0.5em;
  padding: 0 0.4em 0.2em 0.4em;
`;
