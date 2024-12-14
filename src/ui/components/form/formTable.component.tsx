import styled, { css } from 'styled-components';
import { ReactProps } from '../../types';

interface FormTableProps extends ReactProps {
  width?: string;
  thAlign?: string;
  visible?: boolean;
}

export default function FormTable({ children, width, thAlign, visible }: FormTableProps) {
  return (<FormTableStyled width={width} thAlign={thAlign} visible={visible}>
    <tbody>
    {children}
    </tbody>
  </FormTableStyled>);
}

export const FormTableStyled = styled.table<{ width?: string, thAlign?: string, visible?: boolean }>`
  //border-collapse: collapse;
  width: ${props => props.width ? props.width : '100%'};
  border-spacing: 3px;

  ${props => props.visible && css`
    background: ${props => props.theme.colors.ui.background5};
    padding: 5px 8px;
    border-radius: 8px;
  `}

  tbody th {
    font-weight: normal;
    text-align: ${props => props.thAlign ? props.thAlign : 'left'};
  }
`;
