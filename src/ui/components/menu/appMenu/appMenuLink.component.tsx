import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import React from 'react';
import { theme } from '../../../style/theme';

interface AppMenuLinkProps {
  to: string,
  icon: string,
  tooltip?: string;
  attentionIcon?: boolean;
  attentionColor?: string;
}

export default function AppMenuLink({ to, icon, tooltip, attentionIcon = false, attentionColor = theme.colors.attention }: AppMenuLinkProps) {

  const pathname = useLocation().pathname;

  function selected() {
    return (pathname.indexOf(to) === 0 && to !== '/') || (pathname === to);
  }

  return (<AppMenuLinkStyled to={to} selected={selected()}>
    {icon && <i className={icon}></i>}
    {attentionIcon && <i className={'attention ri-circle-fill'} style={{ color: attentionColor }}></i>}
    {tooltip && <span className={'tooltip'}>{tooltip}</span>}
  </AppMenuLinkStyled>);
}

const AppMenuLinkStyled = styled(Link)<{ selected: boolean }>`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    border-radius: 0 0 7px 7px;
    transition: 0.1s linear;
    position: relative;
    padding: ${props => props.selected ? '15px 16px 12px 16px' : '10px 16px'};
    margin-bottom: ${props => props.selected ? '0' : '7px'};
    background-color: ${props => props.selected ? props.theme.colors.navBar.activeBg : props.theme.colors.navBar.bg};

    i {
        color: ${props => props.selected ? props.theme.colors.navBar.activeIcon : props.theme.colors.navBar.icon};
        font-size: 32px;
        transition: 0.1s linear;
    }

    .tooltip {
        display: none;
        position: absolute;
        top: -35px;
        text-shadow: 0 0 5px ${props => props.theme.colors.ui.appBgOpaque};
        background: #111;
        padding: 4px 12px;
        border-radius: 8px;
        color: ${props => props.theme.colors.font.text};
        width: max-content;
    }

    .attention {
        color: ${props => props.theme.colors.attention};
        font-size: 10px;
        position: absolute;
        top: ${props => props.selected ? '16px' : '10px'};
        right: 10px;
        transition: 0.1s linear;
    }

    :hover {
        padding: 15px 16px 12px 16px;
        margin-bottom: 0;
        background-color: ${props => props.selected ? props.theme.colors.navBar.activeBg : props.theme.colors.navBar.hoverBg};

        i {
            color: ${props => props.theme.colors.navBar.hoverIcon};
            color: ${props => props.selected ? props.theme.colors.navBar.activeIcon : props.theme.colors.navBar.hoverIcon};
        }

        .tooltip {
            animation: AppMenuLinkTooltip 150ms;
            display: block;
        }

        .attention {
            top: 16px;
        }
    }


    @keyframes AppMenuLinkTooltip {
        from {
            top: -10px;
            opacity: 0;
        }
        to {
            top: -35px;
            opacity: 1;
        }
    }
`;
