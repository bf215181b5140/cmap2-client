import { ReactProps } from 'cmap2-shared';
import styled, { css } from 'styled-components';

interface ContentBoxMenuLinkProps extends ReactProps {
    onClick: () => void;
    isActive: boolean;
    disabled?: boolean;
}

export default function ContentBoxMenuLink({onClick, isActive, disabled = false, children}: ContentBoxMenuLinkProps) {

    return (<ContentBoxMenuLinkStyled isActive={isActive} onClick={onClick} disabled={disabled}>
        {children}
    </ContentBoxMenuLinkStyled>);
}

const highlight = css`
  background-color: ${props => props.theme.colors.buttons.secondary.hoverBg};
  border-color: ${props => props.theme.colors.buttons.secondary.hoverBorder};
  color: ${props => props.theme.colors.buttons.secondary.hoverBorder};
`;

const ContentBoxMenuLinkStyled = styled.div<{ isActive: boolean, disabled: boolean }>`
  display: block;
  background-color: ${props => props.theme.colors.buttons.secondary.bg};
  border: 2px solid ${props => props.theme.colors.buttons.secondary.border};
  transition: 0.1s linear;
  text-decoration: none;
  padding: 8px 14px;
  font-size: 18px;
  border-radius: 7px;
  color: ${props => props.theme.colors.buttons.secondary.hoverBorder};
  cursor: pointer;

  ${props => props.isActive ? highlight : null};

  :hover {
    ${highlight}
  }

  &[disabled] {
    pointer-events: none;
    color: ${props => props.theme.colors.input.textDisabled};
    filter: saturate(0%);
  }
`;
