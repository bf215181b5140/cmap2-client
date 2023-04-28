import { ReactProps } from "../../../shared/global";
import styled from "styled-components";
import React from "react";
import colors from 'cmap2-shared/src/colors.json';
import Icon from 'cmap2-shared/dist/components/icon.component';

interface PickerOverlayProps extends ReactProps {
    selected?: boolean;
}

export default function PickerOverlay({selected, children}: PickerOverlayProps) {

    return (<PickerOverlayStyled>
        <PickerOverlayCheck selected={selected}>
            <Icon icon='ri-check-line' />
        </PickerOverlayCheck>
        {children}
    </PickerOverlayStyled>);
}

const PickerOverlayStyled = styled.div`
  position: relative;
  margin: 0;
  padding: 0;
`;

const PickerOverlayCheck = styled.div<{ selected?: boolean }>`
  position: absolute;
  top: 1em;
  right: 1em;
  background: ${colors['button-bg']};
  border-radius: 1em;
  
  display: ${props => props.selected ? 'block' : 'none'};
`;
