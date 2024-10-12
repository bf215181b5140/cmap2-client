import styled from 'styled-components';
import { ReactProps } from '../../types';

interface FormControlBarProps extends ReactProps {
  justifyContent?: string;
}

export default function FormControlBar({ justifyContent, children }: FormControlBarProps) {
  return (<FormControlStyled justifyContent={justifyContent}>
    {children}
  </FormControlStyled>);
}

const FormControlStyled = styled.div<{ justifyContent?: string }>`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: ${props => props.justifyContent ?? 'flex-end'};
    align-items: center;

    hr {
        height: 44px;
    }
`;
