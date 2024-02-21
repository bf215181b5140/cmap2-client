import { ReactProps } from 'cmap2-shared';
import styled from 'styled-components';
import React from 'react';
import { ToastReducerAction, useToast } from '../toast/toast.hook';
import { ToastComponent } from '../toast/toast.component';
import colors from 'cmap2-shared/src/colors.json';
import ModalComponent from '../../shared/components/modal/modal.component';
import ModalHook, { ModalFunction } from '../../shared/components/modal/modal.hook';

export const ToastContext = React.createContext<(action: ToastReducerAction) => void>(() => {
});

export const ModalContext = React.createContext<ModalFunction>({
  setModal: () => {},
  clearModal: () => {},
  deleteModal: () => {}
});

export default function MainWindow({children}: ReactProps) {

    const {toasts, toastsDispatch} = useToast();
    const {modal, setModal, clearModal, deleteModal} = ModalHook();

    return(<MainWindowStyled>
        <ToastContext.Provider value={toastsDispatch}>
        <ModalContext.Provider value={{setModal, clearModal, deleteModal}}>
            <MainWindowOverflow>
                <ModalComponent modal={modal} clearModal={clearModal} />
                {children}
            </MainWindowOverflow>
            <ToastComponent toasts={toasts} dispatch={toastsDispatch} />
        </ModalContext.Provider>
        </ToastContext.Provider>
    </MainWindowStyled>);
}

const MainWindowStyled = styled.div`
  overflow: hidden;
  width: 100%;
  background-color: ${colors['app-bg']};
  border: 2px solid ${colors['app-border']};
  border-radius: 10px;
  box-sizing: border-box;
  flex: 1;
  position: relative;

`;

const MainWindowOverflow = styled.div`
  overflow: auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
