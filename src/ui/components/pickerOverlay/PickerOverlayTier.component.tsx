import styled from 'styled-components';
import React from 'react';
import { TierDTO } from 'cmap2-shared';
import Icon from '../icon/icon.component';

interface PickerOverlayTierProps {
    tier: TierDTO;
    valid?: boolean;
}

export default function PickerOverlayTier({ tier, valid = true }: PickerOverlayTierProps) {

    return (<PickerOverlayTierStyled valid={valid}>
        <Icon icon="ri-medal-fill" color={tier.color} />
        {tier.label}
    </PickerOverlayTierStyled>);
}

const PickerOverlayTierStyled = styled.div<{ valid?: boolean }>`
    position: absolute;
    top: 8px;
    left: 8px;
    font-size: 14px;
    background: ${props => props.theme.colors.buttons.primary.bg};
    padding: 4px 6px;
    border-radius: 5px;
    border: 1px solid ${props => props.theme.colors.buttons.primary.border};
    text-transform: capitalize;
    color: ${props => props.valid ? props.theme.colors.font.text : props.theme.colors.error};
`;
