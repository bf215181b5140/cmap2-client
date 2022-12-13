import styled from 'styled-components';
import colors from '../style/colors.json';
import { Link, useLocation } from 'react-router-dom';

interface NavBarLinkProps {
    to: string,
    icon?: string,
    children?: any
}

export default function NavBarLink({
                                       to,
                                       icon,
                                       children
                                   }: NavBarLinkProps) {

    const pathname = useLocation().pathname;
    if ((pathname.indexOf(to) === 0 && to !== '/') || (pathname === to)) {
        return (<NavBarLinkSelectedStyled to={to}>
            {icon && <i className={icon}></i>} {children}
        </NavBarLinkSelectedStyled>)
    }

    return (<NavBarLinkStyled to={to}>
        {icon && <i className={icon}></i>} {children}
    </NavBarLinkStyled>);
}

const NavBarLinkStyled = styled(Link)`
  display: block;
  background-color: ${colors['ui-navBar-7']};
  margin-bottom: 7px;
  transition: 0.1s linear;
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 0 0 7px 7px;

  :hover {
    padding: 15px 16px 12px 16px;
    margin-bottom: 0;
    background-color: ${colors['ui-navBar-8']};

    i {
      color: ${colors['ui-navBar-11']};
    }
  }

  i {
    color: ${colors['ui-navBar-10']};
    //float: left;
    font-size: 2em;
    //margin: -0.2em 0 -0.2em -0.2em;
  }
`;

const NavBarLinkSelectedStyled = styled(Link)`
  display: block;
  padding: 15px 16px 12px 16px;
  margin-bottom: 0;
  background-color: ${colors['ui-navBar-12']};
  transition: 0.1s linear;
  text-decoration: none;
  border-radius: 0 0 7px 7px;

  i {
    color: ${colors['ui-navBar-13']};
    font-size: 2em;
  }
`;
