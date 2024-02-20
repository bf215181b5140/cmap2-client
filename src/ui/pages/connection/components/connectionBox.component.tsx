import { ReactProps } from 'cmap2-shared';
import styled, { css } from 'styled-components';
import Icon from 'cmap2-shared/src/react/components/icon.component';
import colors from 'cmap2-shared/src/colors.json';
import { Link } from 'react-router-dom';

interface ConnectionBoxProps extends ReactProps {
    icon: string;
    connected: boolean;
    redirectPath: string;
}

export default function ConnectionBox({icon, connected, redirectPath, children}: ConnectionBoxProps) {

    return (<ConnectionBoxStyled connected={connected} to={redirectPath}>
        <IconStyled>
            <Icon icon={icon} />
        </IconStyled>
        <ChildrenStyled>
            {children}
        </ChildrenStyled>
    </ConnectionBoxStyled>);
}

const ConnectionBoxStyled = styled(Link)<{ connected: boolean }>`
  display: flex;
  flex-direction: row;
  //flex-wrap: wrap;
  background-color: ${colors['content-bg']};
  border: 2px solid;
  border-radius: 8px;
  transition: 0.15s linear;
  border-color: ${props => props.connected ? colors['button-border'] : 'darkred'};
  cursor: pointer;

  :hover {
    background-color: ${colors['button-hover-bg']};
    border-color: ${colors['button-hover-border']};
  }
`;

const IconStyled = styled.div`
  width: 75px;
  height: 75px;
  text-align: center;
  font-size: 20px;
`;

const ChildrenStyled = styled.div`
  margin: 10px;

  h1, h2, h3, p {
    margin: 0 0 5px 0;
  }

  h1 {
    font-size: 18px;
  }

  h2 {
    font-size: 16px;
  }
`;
