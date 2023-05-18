import styled from 'styled-components';
import { ReactProps } from 'cmap2-shared';

interface FormTableProps extends ReactProps {
    width?: string;
}

export function FormTable({children, width}: FormTableProps) {
    return (<FormTableStyled width={width}>
        <tbody>
        {children}
        </tbody>
    </FormTableStyled>);
}

export function FormControl({children}: ReactProps) {
    return (<FormControlStyled>
        {children}
    </FormControlStyled>);
}

const FormTableStyled = styled.table<{width?: string}>`
  border-collapse: collapse;
  width: ${props => props.width ? props.width : 'auto'};
  
  th {
    text-align: left;
  }
`;

const FormControlStyled = styled.div`
display: block;
  text-align: right;
`;
