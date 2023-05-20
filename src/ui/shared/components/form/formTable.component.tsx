import styled from 'styled-components';
import { ReactProps } from 'cmap2-shared';

interface FormTableProps extends ReactProps {
    width?: string;
}

export default function FormTable({children, width}: FormTableProps) {
    return (<FormTableStyled width={width}>
        <tbody>
        {children}
        </tbody>
    </FormTableStyled>);
}

export const FormTableStyled = styled.table<{width?: string}>`
  border-collapse: collapse;
  width: ${props => props.width ? props.width : 'auto'};
  
  thead th {
    padding-left: 10px;
    text-align: left;
  }
  
  tbody th {
    text-align: left;
  }
`;
