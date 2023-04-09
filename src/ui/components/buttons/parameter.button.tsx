import { ReactProps } from '../../../shared/global';
import { ButtonDto } from 'cmap2-shared';
import styled from 'styled-components';
import colors from '../../style/colors.json';

interface ParameterButtonProps extends ReactProps {
    button: ButtonDto;
    onClick?: () => void;
    flexBasis?: string;
}

export default function ParameterButton(props: ParameterButtonProps) {
    function onClick() {
        if (props.onClick) props.onClick();
    }

    return (<ParameterButtonStyled onClick={() => onClick()} flexBasis={props.flexBasis}>
        {props.button.label}
    </ParameterButtonStyled>);
}

const ParameterButtonStyled = styled.div<{ flexBasis?: string }>`
  flex-basis: ${props => props.flexBasis ? props.flexBasis : '100%'};
  background: ${colors['ui-primary-1']};
  border-radius: 8px;
  padding: 15px;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  transition: 0.2s linear;

  :hover {
    transform: scale(1.05) perspective(1px);
    background: ${colors['ui-primary-3']};
    border: 2px solid ${colors['ui-primary-4']};
  }

`;
