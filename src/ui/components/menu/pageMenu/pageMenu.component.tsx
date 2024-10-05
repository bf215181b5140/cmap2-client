import styled, { css } from 'styled-components';
import { PAGE_ELEMENT_GAP } from '../../page/page.component';
import { ReactProps } from '../../../types';

interface PageMenuProps extends ReactProps {
    noMarginTop?: boolean;
    className?: string;
}

export default function PageMenu({ noMarginTop, className, children }: PageMenuProps) {

    return (<PageMenuStyled noMarginTop={!!noMarginTop} className={className}>
        {children}
    </PageMenuStyled>);
}

const PageMenuStyled = styled.div<{ noMarginTop?: boolean }>`
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
    ${props => {
        if (props.noMarginTop) {
            return css`
            margin-top: -${PAGE_ELEMENT_GAP};
            border-radius: 0 0 8px 8px;
        `;
        }
    }};

    hr {
        border: 1px solid ${props => props.theme.colors.submenu.bg} !important;
        margin: 0 5px;
        padding: 0;
        height: 70%;
    }
`;