import { ReactProps, TierDTO } from 'cmap2-shared';
import styled from 'styled-components';
import Icon from '../../../../components/icon/icon.component';

interface TierBadgeProps extends ReactProps {
    tier: TierDTO;
}

export default function TierBadge({ tier }: TierBadgeProps) {

    return (<TierBadgeStyled color={tier.color}>
        <Icon icon="ri-medal-fill" color={tier.color} />
        {tier.label}
    </TierBadgeStyled>);
}

const TierBadgeStyled = styled.span<{ color?: string }>`
    display: inline-block;
    border: 1px solid ${props => props.color};
    border-radius: 6px;
    padding: 2px 6px 3px 4px;
    text-transform: capitalize;
`;
