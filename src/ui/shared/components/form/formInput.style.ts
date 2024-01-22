import { css } from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';

export const globalInputStyle = css<{ errors?: boolean, width?: string }>`
  font-family: Dosis-Bold, sans-serif;
  font-size: 1em;
  margin: 7px;
  padding: 10px;
  color: ${colors['text-1']};
  background: ${colors['ui-primary-1']};
  border: 2px solid ${colors['ui-primary-2']};
  border-color: ${props => props.errors ? colors['error'] : colors['ui-primary-2']};
  border-radius: 7px;
  transition: 0.1s linear;
  width: ${props => props.width ? props.width : '250px'};

  :hover {
    background: ${colors['ui-primary-3']};
    border-color: ${props => props.errors ? colors['error'] : colors['ui-primary-4']};
  }

  :focus-visible {
    background: ${colors['ui-primary-3']};
    border-color: ${props => props.errors ? colors['error'] : colors['ui-primary-4']};
    outline: none;
  }

  :disabled {
    pointer-events: none;
    color: ${colors['font-text-disabled']};
    filter: saturate(0.5%);
  }
`;
