import styled from 'styled-components';
import { ReactProps } from 'cmap2-shared';

export default function ContentMenu({ children }: ReactProps) {

    return (<ContentMenuStyled>
            {children}
    </ContentMenuStyled>);
}

const ContentMenuStyled = styled.div`
    background: ${props => props.theme.colors.ui.background3};
    position: sticky;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    z-index: 10;

    hr {
        border: 1px solid ${props => props.theme.colors.submenu.bg} !important;
        margin: 3px 5px !important;
        padding: 0 !important;
    }
`;
