import styled from 'styled-components';
import { globalInputStyle } from '../form/input.style';
import Icon from 'cmap2-shared/src/react/components/icon.component';
import React from 'react';

interface CheckboxButtonProps {
    value: boolean;
    onClick: (value: boolean) => void;
}

export default function CheckboxButton({ value, onClick }: CheckboxButtonProps) {

    function onCheck() {
        onClick(!value);
    }

    return (<CheckboxButtonStyled onClick={() => onCheck()} checked={value}>
            <Icon icon="ri-check-fill" />
        </CheckboxButtonStyled>
    );
}

const CheckboxButtonStyled = styled.div<{ checked: boolean }>`
  ${globalInputStyle};
  cursor: pointer;
  width: 44px;
  font-size: 35px;

  i {
    visibility: ${props => props.checked ? 'visible' : 'hidden'};
  }
`;
