import styled from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';
import { Link, useLocation } from 'react-router-dom';

interface NavBarLinkProps {
    to: string,
    icon?: string,
    children?: any
}

export default function NavBarLink({to, icon, children}: NavBarLinkProps) {

    const pathname = useLocation().pathname;
    if ((pathname.indexOf(to) === 0 && to !== '/') || (pathname === to)) {
        return (<NavBarLinkSelectedStyled to={to}>
            {icon && <i className={icon}></i>} {children}
        </NavBarLinkSelectedStyled>);
    }

    return (<NavBarLinkStyled to={to}>
        {icon && <i className={icon}></i>} {children}
    </NavBarLinkStyled>);
}

const NavBarLinkStyled = styled(Link)`
  display: block;
  background-color: ${colors['nav-bg']};
  margin-bottom: 7px;
  transition: 0.1s linear;
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 0 0 7px 7px;

  :hover {
    padding: 15px 16px 12px 16px;
    margin-bottom: 0;
    background-color: ${colors['nav-hover-bg']};

    i {
      color: ${colors['nav-hover-icon']};
    }
  }

  i {
    color: ${colors['nav-icon']};
    //float: left;
    font-size: 2em;
    //margin: -0.2em 0 -0.2em -0.2em;
  }
`;

const NavBarLinkSelectedStyled = styled(Link)`
  display: block;
  padding: 15px 16px 12px 16px;
  margin-bottom: 0;
  background-color: ${colors['nav-active-bg']};
  transition: 0.1s linear;
  text-decoration: none;
  border-radius: 0 0 7px 7px;

  i {
    color: ${colors['nav-active-icon']};
    font-size: 2em;
  }
`;
