import { ReactProps } from 'cmap2-shared';
import styled from 'styled-components';
import React from 'react';
import ModalComponent from '../modal/modal.component';
import { ToastComponent } from '../toast/toast.component';
import { FetchStatusComponent } from '../fetchStatus/fetchStatus.component';

export default function Content({ children }: ReactProps) {

    return (<ContentStyled>
        <ContentOverflow>
            {children}
        </ContentOverflow>
        <ModalComponent />
        <ToastComponent />
        <FetchStatusComponent />
    </ContentStyled>);
}

const ContentStyled = styled.div`
    overflow: hidden;
    width: 100%;
    background-color: ${props => props.theme.colors.ui.appBgOpaque};
    border: 2px solid ${props => props.theme.colors.ui.appBorder};
    border-radius: 10px;
    flex: 1;
    position: relative;
`;

const ContentOverflow = styled.div`
    overflow: auto;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
`;
