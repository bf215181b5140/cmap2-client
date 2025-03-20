import React, { MouseEventHandler } from 'react';
import styled from 'styled-components';
import { globalInputStyle } from '../input/input.style';
import { ReactProps } from '../../types';

interface TextButtonProps extends ReactProps {
  type?: 'button' | 'submit';
  text: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLInputElement>;
  icon?: string;
  className?: string;
}

export default function TextButton({ type = 'button', text, disabled, onClick, className }: TextButtonProps) {

  return (<TextButtonStyled type={type} value={text} onClick={onClick} disabled={disabled} className={className} />);
};

const TextButtonStyled = styled.input`
  ${globalInputStyle};
  width: auto;
  cursor: pointer;

  :hover {
    transform: scale(1.08);
  }
`;
