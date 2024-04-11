import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { theme } from 'cmap2-shared';

interface NavBarLinkProps {
    to: string,
    icon: string,
    attentionIcon?: boolean;
    attentionColor?: string;
}

export default function NavBarLink({to, icon, attentionIcon = false, attentionColor = theme.colors.attention}: NavBarLinkProps) {

    const pathname = useLocation().pathname;

    function selected() {
        return (pathname.indexOf(to) === 0 && to !== '/') || (pathname === to);
    }

    return (<NavBarLinkStyled to={to} $selected={selected()}>
        {icon && <i className={icon}></i>}
        {attentionIcon && <i className="attention ri-circle-fill" style={{color: attentionColor}}></i>}
    </NavBarLinkStyled>);
}

const NavBarLinkStyled = styled(Link)<{ $selected: boolean }>`
  display: block;
  text-decoration: none;
  border-radius: 0 0 7px 7px;
  transition: 0.1s linear;
  position: relative;
  padding: ${props => props.$selected ? '15px 16px 12px 16px' : '10px 16px'};
  margin-bottom: ${props => props.$selected ? '0' : '7px'};
  background-color: ${props => props.$selected ? props.theme.colors.navBar.activeBg : props.theme.colors.navBar.bg};

  i {
    color: ${props => props.$selected ? props.theme.colors.navBar.activeIcon : props.theme.colors.navBar.icon};
    font-size: 32px;
    transition: 0.1s linear;
  }

  .attention {
    color: ${props => props.theme.colors.attention};
    font-size: 10px;
    position: absolute;
    top: ${props => props.$selected ? '16px' : '10px'};
    right: 10px;
    transition: 0.1s linear;
  }

  :hover {
    padding: 15px 16px 12px 16px;
    margin-bottom: 0;
    background-color: ${props => props.$selected ? props.theme.colors.navBar.activeBg : props.theme.colors.navBar.hoverBg};

    i {
      color: ${props => props.theme.colors.navBar.hoverIcon};
      color: ${props => props.$selected ? props.theme.colors.navBar.activeIcon : props.theme.colors.navBar.hoverIcon};
    }

    .attention {
      top: 16px;
    }
  }
`;
