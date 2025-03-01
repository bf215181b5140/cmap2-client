import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import React from 'react';
import { theme } from '../../../style/theme';
import { NotificationType } from 'cmap2-shared';

interface AppMenuLinkProps {
  to: string,
  icon: string,
  text: string;
  notification?: NotificationType;
}

export default function AppMenuLink({ to, icon, text, notification }: AppMenuLinkProps) {

  const pathname = useLocation().pathname;
  const selected = (pathname.indexOf(to) === 0 && to !== '/') || (pathname === to);

  return (<AppMenuLinkStyled to={to} selected={selected}>
    <i className={icon} />
    {text}
  </AppMenuLinkStyled>);
}

const AppMenuLinkStyled = styled(Link).attrs({ className: 'appMenuLink' })<{ selected: boolean }>`
  &.appMenuLink {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    border-radius: 0 0 7px 7px;
    transition: 0.1s linear;
    position: relative;
    padding: ${props => props.selected ? '12px 0 10px 0' : '6px 0 8px 0'};
    margin-bottom: ${props => props.selected ? '0' : '8px'};
    background-color: ${props => props.selected ? props.theme.colors.navBar.activeBg : props.theme.colors.navBar.bg};
    width: 90px;
    color: ${props => props.selected ? props.theme.colors.navBar.activeIcon : props.theme.colors.navBar.text};
    font-weight: normal;
    text-align: center;
    font-size: 14px;

    i {
      font-size: 30px;
      transition: 0.1s linear;
    }

    :hover {
      padding: 12px 0 10px 0;
      margin-bottom: 0;
      background-color: ${props => props.selected ? props.theme.colors.navBar.activeBg : props.theme.colors.navBar.hoverBg};
      color: ${props => props.selected ? props.theme.colors.navBar.activeIcon : props.theme.colors.navBar.hoverIcon};

      i {
        color: ${props => props.selected ? props.theme.colors.navBar.activeIcon : props.theme.colors.navBar.hoverIcon};
      }
    }
  }
`;
