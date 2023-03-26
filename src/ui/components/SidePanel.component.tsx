import { AvatarDto } from 'cmap2-shared';
import styled from 'styled-components';
import colors from '../style/colors.json';
import { ReactProps } from '../../shared/global';

interface SidePanelProps extends ReactProps {
    title?: string;
    icon?: string;
}

export function SidePanel(props: SidePanelProps) {

    return (<SidePanelStyled>
        {props.title && <Title>{props.icon && <i className={props.icon}></i>}{props.title}</Title>}
        {props.children}
    </SidePanelStyled>);
}

const Title = styled.div`
  text-align: center;
  margin: 10px 5px 15px 5px;
  font-size: 24px;
  color: ${colors['text-1']};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, ${colors['text-4']}, ${colors['text-5']});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
    
  i {
    font-size: 1.8em;
    margin-right: 15px;
    margin-left: -0.5em;
  }
`;

const SidePanelStyled = styled.div`
  margin: 0 20px 0 0;
  padding: 0 7px;
  width: 220px;
  height: 100%;
  float: left;
  position: sticky;
  top: 0;
  background-color: ${colors['ui-primary-7']};

  h1 {
    display: block;
    text-align: center;
    margin: 5px 5px 15px 5px;
    font-size: 24px;
    color: ${colors['text-1']};
  }
`;

export const SidePanelButton = styled.button<{active?: boolean}>`
    font-family: Dosis-Bold, sans-serif;
    margin: 10px 0;
    padding: 7px;
    display: block;
    width: 100%;
    color: ${colors['text-1']};
    background-color: ${props => props.active ? colors['ui-primary-3'] : colors['ui-primary-8']};
    border: 2px solid ${props => props.active ? colors['ui-primary-4'] : 'transparent'};
    border-radius: 7px;
    font-size: 16px;
    transition: 0.15s linear;
    box-shadow: 0 0 5px ${colors['ui-primary-9']};

    :hover {
      //transform: scale(1.05) perspective(1px);
      // background: ${colors['ui-primary-3']};
      border: 2px solid ${colors['ui-primary-4']};
    }

  &.addButton {
    background: ${colors['ui-primary-7']};

    i {
      font-size: 24px;
    }
  }
`;
