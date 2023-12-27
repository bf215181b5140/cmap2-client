import styled from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';

interface ActionButtonProps {
    children?: any,
    action?: () => void,
    icon?: string
}

export default function ActionButton({ children, action, icon }: ActionButtonProps) {

    return (<ActionButtonStyled>
        <button onClick={action}>{icon && <i className={icon}></i>} {children}</button>
    </ActionButtonStyled>);
}

const ActionButtonStyled = styled.div`
  display: inline-block;

  button {
    font-family: Dosis-Bold, sans-serif;
    margin: 7px;
    padding: 10px;
    color: ${colors['text-1']};
    background: ${colors['ui-primary-1']};
    border: 2px solid ${colors['ui-primary-2']};
    border-radius: 7px;
    font-size: 16px;
    transition: 0.15s linear;
    cursor: pointer;

    :hover {
      transform: scale(1.05) perspective(1px);
      background: ${colors['ui-primary-3']};
      border: 2px solid ${colors['ui-primary-4']};
    }

    i {
      color: ${colors['ui-primary-5']};
      float: left;
      font-size: 1.75em;
      margin: -0.12em 0 -0.12em -0.12em;
    }
  }
`;
