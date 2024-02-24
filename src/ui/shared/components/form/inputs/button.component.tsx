import React from 'react';
import styled from 'styled-components';
import { globalInputStyle } from '../input.style';
import { ReactProps } from 'cmap2-shared';

interface ButtonInputProps extends ReactProps {
    type?: 'button' | 'submit';
    text: string;
    disabled?: boolean;
    onClick?: () => void;
    icon?: string;
}

export default function ButtonInput({type = 'button', text, disabled, onClick}: ButtonInputProps) {

    return (<ButtonInputStyled type={type} value={text} onClick={onClick} disabled={disabled} />);
};

const ButtonInputStyled = styled.input`
  ${globalInputStyle};
  width: auto;
  cursor: pointer;

  :hover {
    transform: scale(1.05);
  }
`;
