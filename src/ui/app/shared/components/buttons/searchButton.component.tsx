import styled from 'styled-components';
import { useContext } from 'react';
import { ModalContext } from '../../../components/mainWindow/mainWindow.componenet';
import { globalInputStyle } from '../form/input.style';

interface SearchButtonProps {
    onClick: () => void;
    disabled?: boolean;
    className?: string;
}

export default function SearchButton({onClick, disabled, className}: SearchButtonProps) {

    return (<SearchButtonStyled onClick={onClick} disabled={!!disabled} className={className}>
        <i className={'ri-menu-search-line'} />
    </SearchButtonStyled>);
}

const SearchButtonStyled = styled.button`
  ${globalInputStyle};
  width: 44px;
  cursor: pointer;
  font-size: 25px;
  vertical-align: top;

  :hover {
    transform: scale(1.05);
  }

  :disabled {
    pointer-events: none;
    color: ${props => props.theme.colors.input.textDisabled};
    background: ${props => props.theme.colors.input.bg};
    border-color: ${props => props.theme.colors.input.border};
    filter: saturate(0%);
  }
`;
