import { ReactProps, TierDto } from 'cmap2-shared';
import styled from 'styled-components';
import Icon from 'cmap2-shared/src/react/components/icon.component';

interface TierBadgeProps extends ReactProps {
    tier: TierDto;
}

export default function TierBadge({ tier }: TierBadgeProps) {

    return(<TierBadgeStyled color={tier.color}>
        <Icon icon='ri-medal-fill' color={tier.color} />
        {tier.tier}
    </TierBadgeStyled>);
}

const TierBadgeStyled = styled.span<{ color: string }>`
  border: 1px solid ${props => props.color};
  border-radius: 0.5em;
  padding: 0 0.4em 0.2em 0.4em;
  text-transform: capitalize;
`;
