import { ReactProps } from 'cmap2-shared';
import styled from 'styled-components';

export default function PageMenu({ children }: ReactProps) {

    return (<PageMenuStyled>
        {children}
    </PageMenuStyled>);
}

const PageMenuStyled = styled.div`
    flex-grow: 2;
    flex-basis: 100%;
    background-color: ${props => props.theme.colors.ui.background3};
    border-radius: 8px;
    padding: 10px;

    display: flex;
    flex-direction: row;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;

    hr {
        border: 1px solid ${props => props.theme.colors.submenu.bg} !important;
        margin: 0 5px;
        padding: 0;
        height: 70%;
    }
`;