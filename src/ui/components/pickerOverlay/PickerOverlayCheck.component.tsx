import styled from 'styled-components';
import React from 'react';
import Icon from '../icon/icon.component';

interface PickerOverlayCheckProps {
  selected: boolean;
}

export default function PickerOverlayCheck({ selected }: PickerOverlayCheckProps) {

  return (<PickerOverlayCheckStyled selected={selected}>
    <Icon icon="ri-check-line" />
  </PickerOverlayCheckStyled>);
}

const PickerOverlayCheckStyled = styled.div<{ selected?: boolean }>`
    position: absolute;
    top: 8px;
    right: 8px;
    background: ${props => props.theme.colors.buttons.primary.bg};
    border-radius: 50%;
    font-size: 20px;
    width: 30px;
    height: 30px;
    text-align: center;
    border: 1px solid ${props => props.theme.colors.font.icon};
    display: ${props => props.selected ? 'block' : 'none'};

    i {
        margin-left: 2px;
    }
`;
