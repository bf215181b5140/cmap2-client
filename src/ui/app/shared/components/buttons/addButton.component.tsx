import styled from 'styled-components';
import { globalInputStyle } from '../form/input.style';

interface AddButtonProps {
    onClick: () => void;
    disabled?: boolean;
    className?: string;
    icon?: string;
}

export default function AddButton({ onClick, disabled, className, icon = 'ri-add-line' }: AddButtonProps) {

    return (<AddButtonStyled type={'button'} onClick={() => onClick()} disabled={!!disabled} className={className}>
        <i className={icon} />
    </AddButtonStyled>);
}

const AddButtonStyled = styled.button`
  ${globalInputStyle};
  width: 44px;
  cursor: pointer;
  background: seagreen;
  border-color: seagreen;
  color: lightgray;
  vertical-align: top;
  font-size: 25px;
  
  :hover {
    transform: scale(1.05);
    background: seagreen;
    border-color: lightgray;
    color: whitesmoke;
  }

  :disabled {
    pointer-events: none;
    color: ${props => props.theme.colors.input.textDisabled};
    background: ${props => props.theme.colors.input.bg};
    border-color: ${props => props.theme.colors.input.border};
    filter: saturate(0%);
  }
`;
