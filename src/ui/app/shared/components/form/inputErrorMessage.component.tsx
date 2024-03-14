import { ReactProps } from 'cmap2-shared';
import styled from 'styled-components';

interface InputErrorMessageProps extends ReactProps {
    errorMessage: string | undefined;
}

export default function InputErrorMessage(props: InputErrorMessageProps) {

    if (typeof props.errorMessage !== 'string' || props.errorMessage === '') return null;

    return (<ErrorStyled>
        {props.errorMessage}
    </ErrorStyled>);
}

const ErrorStyled = styled.div`
  margin: -6px 10px 0 10px;
  font-size: 12px;
  text-align: center;
  color: ${props => props.theme.colors.error};
`;
