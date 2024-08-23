import styled from 'styled-components';
import { globalInputStyle } from '../form/input.style';

interface ActionButtonProps {
    children?: any,
    action?: () => void,
    icon?: string
}

export default function ActionButton({ children, action, icon }: ActionButtonProps) {

    return (<ActionButtonStyled>
        <button type={'button'} onClick={action}>{icon && <i className={icon}></i>} {children}</button>
    </ActionButtonStyled>);
}

const ActionButtonStyled = styled.div`
  display: inline-block;

  button {
    ${globalInputStyle};
    width: auto;
    cursor: pointer;

    :hover {
      transform: scale(1.05);
    }

    i {
      color: ${props => props.theme.colors.font.icon};
      float: left;
      font-size: 1.75em;
      margin: -0.12em 0 -0.12em -0.12em;
    }
  }
`;
