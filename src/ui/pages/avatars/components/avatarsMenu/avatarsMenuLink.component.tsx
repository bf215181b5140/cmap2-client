import styled, { css } from 'styled-components';
import { ReactProps } from 'cmap2-shared';
import colors from 'cmap2-shared/src/colors.json';

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
  background-color: ${colors['button-2-hover-bg']};
  border-color: ${colors['button-2-hover-border']};
  color: ${colors['button-2-hover-border']};
`;

const AvatarsMenuLinkStyled = styled.div<{ isActive: boolean }>`
  display: block;
  background-color: ${colors['button-2-bg']};
  border: 2px solid ${colors['button-2-border']};
  transition: 0.1s linear;
  text-decoration: none;
  padding: 8px 14px;
  font-size: 18px;
  border-radius: 7px;
  color: ${colors['button-2-hover-border']};
  cursor: pointer;

  ${props => props.isActive ? highlight : null};

  :hover {
    ${highlight}
  }
`;
