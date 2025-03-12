import styled, { css } from 'styled-components';
import { ReactProps } from '../../types';

interface FormControlRowProps extends ReactProps {
  colSpan?: number;
  justifyContent?: string
  position?: 'top' | 'middle' | 'bottom';
}

export default function FormControlRow({ colSpan, justifyContent, position = 'bottom', children }: FormControlRowProps) {

  return (<FormControlRowStyled justifyContent={justifyContent} position={position} >
    <td colSpan={colSpan || 1}>
      <div>{children}</div>
    </td>
  </FormControlRowStyled>);
}

const FormControlRowStyled = styled.tr<{ justifyContent?: string, position: 'top' | 'middle' | 'bottom' }>`
  td {
    div {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: ${props => props.justifyContent ?? 'flex-end'};
      align-items: center;
      gap: 6px;
      
      ${props => {
        switch (props.position) {
          case 'top':
            return css`margin-bottom: 6px;`;
          case 'middle':
            return css`margin: 6px 0;`;
          case 'bottom':
            return css`margin-top: 6px;`;
        }
      }};

      hr {
        height: 28px;
      }
    }
  }
`;
