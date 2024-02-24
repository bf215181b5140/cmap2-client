import React from 'react';
import { ReactProps } from 'cmap2-shared';
import styled, { css } from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';

interface ToastProps extends ReactProps {
    toasts: Toast[];
    dispatch: (action: any) => void;
}

export interface Toast {
    id?: string;
    message: string;
    type: ToastType;
}

export enum ToastType {
    INFO,
    WARNING,
    ERROR,
    SUCCESS
}

export function ToastComponent(props: ToastProps) {

    return (<ToastComponentStyled>
        {props.toasts.map(toast => (
            <ToastStyled type={toast.type} key={toast.id}>{toast.message}</ToastStyled>
        ))}
    </ToastComponentStyled>);
};

const ToastComponentStyled = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50px;
  right: 50px;
  pointer-events: none;
`;

const ToastStyled = styled.div<{type: ToastType}>`
  margin: 10px;
  background-color: ${colors['ui-background-3']};
  border: 1px solid;
  padding: 10px 20px;
  border-radius: 8px;
  filter: opacity(0.9);
  pointer-events: none;
  
  ${(props) => {
      switch (props.type) {
        case ToastType.ERROR:
            return css`
              border-color: indianred;
            `;
        case ToastType.INFO:
            return css`
              border-color: cornflowerblue;
            `;
        case ToastType.SUCCESS:
            return css`
              border-color: forestgreen;
            `;
        case ToastType.WARNING:
            return css`
              border-color: orange;
            `;
      }
  }}
`;
