import { ReactProps } from 'cmap2-shared';
import styled from 'styled-components';

export default function FormControlBar({ children }: ReactProps) {
    return (<FormControlStyled>
        {children}
    </FormControlStyled>);
}

const FormControlStyled = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;

    hr {
        height: 44px;
    }
`;
