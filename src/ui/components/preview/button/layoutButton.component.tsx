import styled from 'styled-components';
import { ButtonDTO, StyleDTO } from 'cmap2-shared';
import { MouseEvent } from 'react';
import ParameterButton from './parameter.button';

interface LayoutButtonProps {
  style: StyleDTO;
  button: ButtonDTO;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export default function LayoutButton({ style, button, onClick }: LayoutButtonProps) {

  return (<LayoutButtonStyled onClick={onClick}>
    <ParameterButton button={button} style={style} />
  </LayoutButtonStyled>);
}

const LayoutButtonStyled = styled.div.attrs(() => ({ className: 'layoutButton' }))`
  width: 100%;
  margin-bottom: 20px;
  break-inside: avoid-column;
`;
