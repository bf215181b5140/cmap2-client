import { ReactProps } from 'cmap2-shared';
import styled from 'styled-components';
import React, { useContext } from 'react';
import ModalComponent from '../modal/modal.component';
import { ModalContext } from '../context/modal.context';
import { ToastContext } from '../context/toast.context';
import { ToastComponent } from '../toast/toast.component';

export default function Content({ children }: ReactProps) {

    const { toasts, toastsDispatch } = useContext(ToastContext);
    const { modal, clearModal } = useContext(ModalContext);

    return (<ContentStyled>
        <ContentOverflow>
            {children}
        </ContentOverflow>
        <ModalComponent modal={modal} clearModal={clearModal} />
        <ToastComponent toasts={toasts} dispatch={toastsDispatch} />
    </ContentStyled>);
}

const ContentStyled = styled.div`
    overflow: hidden;
    width: 100%;
    background-color: ${props => props.theme.colors.ui.appBgOpaque};
    border: 2px solid ${props => props.theme.colors.ui.appBorder};
    border-radius: 10px;
    box-sizing: border-box;
    flex: 1;
    position: relative;
`;

const ContentOverflow = styled.div`
    overflow: auto;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;
