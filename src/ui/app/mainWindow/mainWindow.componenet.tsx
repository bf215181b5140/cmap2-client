import { ReactProps } from 'cmap2-shared';
import styled from 'styled-components';
import React from 'react';
import { ToastReducerAction, useToast } from '../toast/toast.hook';
import { ToastComponent } from '../toast/toast.component';
import colors from 'cmap2-shared/src/colors.json';

export const ToastContext = React.createContext<(action: ToastReducerAction) => void>(() => {
});

export default function MainWindow({children}: ReactProps) {

    const {toasts, toastsDispatch} = useToast();

    return(<MainWindowStyled>
        <ToastContext.Provider value={toastsDispatch}>
            <MainWindowOverflow>
                {children}
            </MainWindowOverflow>
            <ToastComponent toasts={toasts} dispatch={toastsDispatch} />
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
`;
