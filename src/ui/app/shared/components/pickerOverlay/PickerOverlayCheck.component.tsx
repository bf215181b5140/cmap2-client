import styled from "styled-components";
import React from "react";
import colors from 'cmap2-shared/src/colors.json';
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
  background: ${colors['button-bg']};
  border-radius: 50%;
  font-size: 1.2em;
  width: 1.5em;
  height: 1.5em;
  text-align: center;
  border: 1px solid ${colors['font-icon-1']};
  
  display: ${props => props.selected ? 'block' : 'none'};
`;
