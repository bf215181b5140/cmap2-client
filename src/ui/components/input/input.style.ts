import styled, { css } from 'styled-components';

export const globalInputStyle = css<{ errors?: boolean, width?: string }>`
  font-family: Dosis-Bold, sans-serif;
  font-size: 16px;
  //margin: 7px;
  padding: 0 10px;
  color: ${props => props.theme.colors.font.text};
  background: ${props => props.theme.colors.input.bg};
  border: 2px solid ${props => props.theme.colors.input.border};
  border-color: ${props => props.errors ? props.theme.colors.error : props.theme.colors.input.border};
  border-radius: 7px;
  transition: 0.1s linear;
  width: ${props => props.width ? props.width : '100%'};
  height: 44px;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  :hover {
    background: ${props => props.theme.colors.input.hoverBg};
    border-color: ${props => props.errors ? props => props.theme.colors.error : props.theme.colors.input.hoverBorder};
  }

  :focus-visible {
    background: ${props => props.theme.colors.input.hoverBg};
    border-color: ${props => props.errors ? props => props.theme.colors.error : props.theme.colors.input.hoverBorder};
    outline: none;
  }

  :disabled, &[readonly] {
    pointer-events: none;
    color: ${props => props.theme.colors.input.textDisabled};
    filter: saturate(0%);
  }
`;

export const InputStyled = styled.input<{ errors?: boolean, width?: string }>`
  ${globalInputStyle};
`;

export const SelectInputStyled = styled.select<{ errors?: boolean, width?: string }>`
  ${globalInputStyle};
  cursor: pointer;
  text-overflow: ellipsis;
  flex-shrink: 0;

  &.readOnly {
    pointer-events: none;
    color: ${props => props.theme.colors.input.textDisabled};
    filter: saturate(0%);
  }
`;

