import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';
import { Tooltip } from 'react-tooltip';

interface SubmenuLinkProps {
    to: string;
    icon: string;
    tooltip?: string;
}

export default function SubmenuLink({to, icon, tooltip}: SubmenuLinkProps) {

    const pathname = useLocation().pathname;

    function isCurrentPath(): boolean {
        return pathname.indexOf(to) === 0;
    }

    return (<>
        <SubmenuLinkStyled to={to} $active={isCurrentPath()}>
            <i className={icon} />
            {tooltip && <div>{tooltip}</div>}
        </SubmenuLinkStyled>
    </>);
}

const highlight = css`
  background-color: ${colors['button-2-hover-bg']};
  border-color: ${colors['button-2-hover-border']};

  i {
    color: ${colors['button-2-hover-border']};
  }
`;

const SubmenuLinkStyled = styled(Link)<{ $active: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  background-color: ${colors['button-2-bg']};
  border: 2px solid ${colors['button-2-border']};
  transition: 0.1s linear;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 7px;
  
  i {
    font-size: 24px;
    display: block;
    color: ${colors['nav-icon']};
  }
  
  div {
    color: ${colors['button-2-hover-border']};
    display: none;
    position: fixed;
    left: 70px;
  }

  ${props => props.$active ? highlight : null};

  :hover {
    ${highlight};
    
    div {
      display: block;
    }
  }
`;
