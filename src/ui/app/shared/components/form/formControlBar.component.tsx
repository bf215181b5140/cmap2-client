import { ReactProps } from "cmap2-shared";
import styled from "styled-components";

export default function FormControlBar({children}: ReactProps) {
    return (<FormControlStyled>
        {children}
    </FormControlStyled>);
}

const FormControlStyled = styled.div`
  display: block;
  text-align: right;
`;
