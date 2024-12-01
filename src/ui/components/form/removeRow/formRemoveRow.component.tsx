import styled from 'styled-components';
import React from 'react';
import { ReactProps } from '../../../types';

interface FormRemoveRowProps extends ReactProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function FormRemoveRow({ onClick, disabled }: FormRemoveRowProps) {

  return (<FormRemoveRowStyled aria-disabled={disabled === true}>
    <i className={'ri-delete-back-2-line'} onClick={() => onClick()} />
  </FormRemoveRowStyled>);
}

const FormRemoveRowStyled = styled.td`
  text-align: center;
  width: 26px;
  
  i {
    padding: 2px 1px;
    cursor: pointer;
    font-size: 25px;
    color: ${props => props.theme.colors.error};
    transition: 0.1s linear;
    
    :hover {
      color: ${props => props.theme.colors.ui.element5};
    }
  }

  &[aria-disabled='true'] {
    pointer-events: none;
    filter: saturate(0%);
    > i {
      color: ${props => props.theme.colors.font.textInactive};
    }
  }
`;
