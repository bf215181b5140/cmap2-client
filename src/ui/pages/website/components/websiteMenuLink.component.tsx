import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';

interface WebsiteMenuLinkProps {
    to: string;
    icon: string;
}

export default function WebsiteMenuLink({to, icon}: WebsiteMenuLinkProps) {

    const pathname = useLocation().pathname;

    function isCurrentPath(): boolean {
        return (pathname.indexOf(to) === 0 && to !== '/website') || pathname === to;
    }

    return (<WebsiteMenuLinkStyled to={to} active={isCurrentPath()}>
        <i className={icon} />
    </WebsiteMenuLinkStyled>);
}

const highlight = css`
  background-color: ${colors['button-2-hover-bg']};
  border-color: ${colors['button-2-hover-border']};

  i {
    color: ${colors['button-2-hover-border']};
  }
`;

const WebsiteMenuLinkStyled = styled(Link)<{ active: boolean }>`
  display: block;
  background-color: ${colors['button-2-bg']};
  border: 2px solid ${colors['button-2-border']};
  transition: 0.1s linear;
  text-decoration: none;
  padding: 8px 14px;
  font-size: 28px;
  border-radius: 7px;
  
  i {
    display: block;
    color: ${colors['nav-icon']};
  }

  ${props => props.active ? highlight : null};

  :hover {
    ${highlight}
  }
`;
