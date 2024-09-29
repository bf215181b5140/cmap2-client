import React from 'react';
import styled from 'styled-components';
import { ReactProps } from 'cmap2-shared';
import { globalInputStyle } from '../../style/input.style';

interface TextButtonProps extends ReactProps {
    type?: 'button' | 'submit';
    text: string;
    disabled?: boolean;
    onClick?: () => void;
    icon?: string;
}

export default function TextButton({type = 'button', text, disabled, onClick}: TextButtonProps) {

    return (<TextButtonStyled type={type} value={text} onClick={onClick} disabled={disabled} />);
};

const TextButtonStyled = styled.input`
  ${globalInputStyle};
  width: auto;
  cursor: pointer;

  :hover {
    transform: scale(1.08);
  }
`;
