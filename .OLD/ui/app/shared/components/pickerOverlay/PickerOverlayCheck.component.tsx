import styled from "styled-components";
import React from "react";
import Icon from 'cmap2-shared/src/react/components/icon.component';
import { ReactProps } from 'cmap2-shared';

interface PickerOverlayCheckProps extends ReactProps {
    selected: boolean;
}

export default function PickerOverlayCheck({selected}: PickerOverlayCheckProps) {

    return (<PickerOverlayCheckStyled selected={selected}>
            <Icon icon='ri-check-line' />
        </PickerOverlayCheckStyled>);
}

const PickerOverlayCheckStyled = styled.div<{ selected?: boolean }>`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  background: ${props => props.theme.colors.buttons.primary.bg};
  border-radius: 50%;
  font-size: 1.2em;
  width: 1.5em;
  height: 1.5em;
  text-align: center;
  border: 1px solid ${props => props.theme.colors.font.icon};
  
  display: ${props => props.selected ? 'block' : 'none'};
`;
