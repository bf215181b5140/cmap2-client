import styled, { css } from 'styled-components';
import { ReactProps } from 'cmap2-shared';

interface AvatarsMenuLinkProps extends ReactProps {
    onClick: () => void;
    isActive: boolean;
}

export default function AvatarsMenuLink({onClick, isActive, children}: AvatarsMenuLinkProps) {

    return (<AvatarsMenuLinkStyled isActive={isActive} onClick={onClick}>
        {children}
    </AvatarsMenuLinkStyled>);
}

const highlight = css`
  background-color: ${props => props.theme.colors.buttonSecondary.hoverBg};
  border-color: ${props => props.theme.colors.buttonSecondary.hoverBorder};
  color: ${props => props.theme.colors.buttonSecondary.hoverBorder};
`;

const AvatarsMenuLinkStyled = styled.div<{ isActive: boolean }>`
  display: block;
  background-color: ${props => props.theme.colors.buttonSecondary.bg};
  border: 2px solid ${props => props.theme.colors.buttonSecondary.border};
  transition: 0.1s linear;
  text-decoration: none;
  padding: 8px 14px;
  font-size: 18px;
  border-radius: 7px;
  color: ${props => props.theme.colors.buttonSecondary.hoverBorder};
  cursor: pointer;

  ${props => props.isActive ? highlight : null};

  :hover {
    ${highlight}
  }
`;
