import styled from "styled-components";
import React from "react";
import { ReactProps, TierDTO } from 'cmap2-shared';
import Icon from '../icon/icon.component';

interface PickerOverlayTierProps extends ReactProps {
    tier: TierDTO;
}

export default function PickerOverlayTier({ tier }: PickerOverlayTierProps) {

    return (<PickerOverlayTierStyled>
        <Icon icon='ri-medal-fill' color={tier.color} />
        {tier.label}
    </PickerOverlayTierStyled>);
}

const PickerOverlayTierStyled = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 14px;
  background: ${props => props.theme.colors.buttons.primary.bg};
  padding: 4px 6px;
  border-radius: 5px;
  border: 1px solid ${props => props.theme.colors.buttons.primary.border};
  text-transform: capitalize;
`;
