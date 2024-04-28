import styled from 'styled-components';
import Icon from 'cmap2-shared/src/react/components/icon.component';
import { ReactProps } from 'cmap2-shared';

interface AddNewButtonProps extends ReactProps {
    onClick?: () => void;
}

export default function AddNewButton({ onClick }: AddNewButtonProps) {

    return(<AddNewButtonStyled onClick={onClick}>
<Icon icon='ri-add-line' />
    </AddNewButtonStyled>);
}

const AddNewButtonStyled = styled.div`
  align-self: flex-start;
  text-align: center;
  font-size: 2em;
  padding: 0.3em 1.5em 0.5em 1.5em;
  cursor: pointer;
  
  border: 2px solid ${props => props.theme.colors.buttons.secondary.border};
  border-radius: 8px;
  transition: 0.2s linear;

  :hover {
    transform: scale(1.02);
    background: ${props => props.theme.colors.buttons.secondary.hoverBg};
    border: 2px solid ${props => props.theme.colors.buttons.secondary.hoverBorder};
  }

`;
