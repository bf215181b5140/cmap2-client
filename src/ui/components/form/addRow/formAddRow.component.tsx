import styled from 'styled-components';
import React from 'react';
import AddCounter from '../../addCounter/addCounter.component';

interface FormAddRowProps {
  onClick: () => void;
  colSpan?: number;
  items?: number;
  limit?: number;
}

export default function FormAddRow({ onClick, colSpan = 1, items, limit }: FormAddRowProps) {

  const showCount = items !== undefined && limit !== undefined;
  const limitReached = showCount && items >= limit;
  const canAddMore = !showCount || !limitReached;

  return (<FormAddRowStyled onClick={() => onClick()} colSpan={colSpan} aria-disabled={!canAddMore}>
    {showCount && <AddCounter canAddMore={!limitReached}>{items}/{limit}</AddCounter>}
    {canAddMore ? 'Add new' : 'Limit reached'}
    <i className={'ri-add-line'} />
  </FormAddRowStyled>);
}

const FormAddRowStyled = styled.td`
  position: relative;
  text-align: center;
  border: 2px dashed ${props => props.theme.colors.ui.element2};
  padding: 7px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.1s linear;
  
  :hover {
    border-color: ${props => props.theme.colors.ui.element5};
    
    > i {
      color: ${props => props.theme.colors.ui.element5};
    }
  }
  
  > i {
    position: absolute;
    top: 6px;
    right: 7px;
    font-size: 20px;
    color: ${props => props.theme.colors.success};
  }

  &[aria-disabled='true'] {
    pointer-events: none;
    border: none;
    
    > i {
      display: none;
    }
  }
`;
