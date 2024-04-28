import { ReactProps } from 'cmap2-shared';
import styled from 'styled-components';
import Icon from 'cmap2-shared/src/react/components/icon.component';
import { useNavigate } from 'react-router-dom';

interface ConnectionBoxProps extends ReactProps {
    icon: string;
    connected: boolean;
    redirectPath: string;
}

export default function ConnectionBox({icon, connected, redirectPath, children}: ConnectionBoxProps) {

    const navigate = useNavigate();

    function redirect() {
        navigate(redirectPath);
    }

    return (<ConnectionBoxStyled connected={connected} onClick={redirect}>
        <IconStyled>
            <Icon icon={icon} />
        </IconStyled>
        <ChildrenStyled>
            {children}
        </ChildrenStyled>
    </ConnectionBoxStyled>);
}

const ConnectionBoxStyled = styled.div<{ connected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.ui.contentBg};
  border: 2px solid ${props => props.theme.colors.buttons.primary.border};
  border-radius: 8px;
  transition: 0.15s linear;
  // border-color: ${props => props.connected ? props.theme.colors.buttons.primary.border : props.theme.colors.error};
  cursor: pointer;

  :hover {
    background-color: ${props => props.theme.colors.buttons.primary.hoverBg};
    border-color: ${props => props.theme.colors.buttons.primary.hoverBorder};
  }
`;

const IconStyled = styled.div`
  width: 120px;
  height: 75px;
  text-align: center;
  font-size: 50px;
`;

const ChildrenStyled = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 5px;

  // Need !important because for some reason this doesn't override parent styles (contentBox)
  h1, h2, h3, p {
    margin: 0 !important;
    padding: 0 !important;
  }

  h1 {
    font-size: 20px !important;
  }

  h2 {
    font-size: 18px !important;
  }
`;
