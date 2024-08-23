import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';

interface SubmenuLinkProps {
    to: string;
    icon: string;
    disabled?: boolean;
    tooltip?: string;
    attention?: boolean;
}

export default function SubmenuLink({ to, icon, disabled = false, tooltip, attention = false }: SubmenuLinkProps) {

    const pathname = useLocation().pathname;

    function isCurrentPath(): boolean {
        return pathname.indexOf(to) === 0;
    }

    return (<>
        <SubmenuLinkStyled to={to} $active={isCurrentPath()} disabled={disabled}>
            <i className={icon} />
            {tooltip && <div className="tooltip">{tooltip}</div>}
            {attention && <i className="ri-circle-fill attention"></i>}
        </SubmenuLinkStyled>
    </>);
}

const highlight = css`
  background-color: ${props => props.theme.colors.submenu.hoverBg};
  border-color: ${props => props.theme.colors.submenu.hoverBorder};

  i {
    color: ${props => props.theme.colors.submenu.hoverIcon};
  }
`;

const SubmenuLinkStyled = styled(Link)<{ $active: boolean, disabled: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  background-color: ${props => props.theme.colors.submenu.bg};
  border: 2px solid ${props => props.theme.colors.submenu.border};
  transition: 0.1s linear;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 7px;
  position: relative;

  i {
    font-size: 24px;
    display: block;
    color: ${props => props.theme.colors.submenu.icon};
  }

  .tooltip {
    display: none;
    position: fixed;
    left: 76px;
    text-shadow: 0 0 5px ${props => props.theme.colors.ui.appBgOpaque};
    background: #111;
    padding: 4px 12px;
    border-radius: 8px;
    color: ${props => props.theme.colors.font.text};
  }

  .attention {
    color: ${props => props.theme.colors.attention};
    font-size: 10px;
    position: absolute;
    top: 4px;
    right: 5px;
  }

  ${props => props.$active ? highlight : null};

  :hover {
    ${highlight};

    .tooltip {
      animation: submenuLinkTooltip 150ms;
      display: block;
    }

    .attention {
      color: ${props => props.theme.colors.attention};
    }
  }

  &[disabled] {
    pointer-events: none;
    filter: saturate(0%);
  }

  @keyframes submenuLinkTooltip {
    from {
      left: 40px;
      opacity: 0;
    }
    to {
      left: 76px;
      opacity: 1;
    }
  }
`;
