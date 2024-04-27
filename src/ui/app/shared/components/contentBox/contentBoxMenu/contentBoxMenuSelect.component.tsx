import styled from 'styled-components';
import { globalInputStyle } from '../../form/input.style';

export const ContentBoxMenuSelect = styled.select`
  ${globalInputStyle};
  
  background-color: ${props => props.theme.colors.buttonSecondary.bg};
  border: 2px solid ${props => props.theme.colors.buttonSecondary.border};
  transition: 0.1s linear;
  text-decoration: none;
  padding: 8px 14px;
  margin: 0;
  width: auto;
  height: auto;
  font-size: 18px;
  border-radius: 7px;
  color: ${props => props.theme.colors.buttonSecondary.hoverBorder};
  cursor: pointer;

  :hover, :focus-visible {
    background-color: ${props => props.theme.colors.buttonSecondary.hoverBg};
    border-color: ${props => props.theme.colors.buttonSecondary.hoverBorder};
    color: ${props => props.theme.colors.buttonSecondary.hoverBorder};
  }

  &.readOnly {
    pointer-events: none;
    color: ${props => props.theme.colors.input.textDisabled};
    filter: saturate(0%);
  }
`;
