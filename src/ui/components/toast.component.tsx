import React from 'react';
import { ReactProps } from '../../shared/global';
import styled, { css } from 'styled-components';
import colors from '../style/colors.json';

interface ToastProps extends ReactProps {
    toasts: Toast[];
    dispatch: (action: any) => void;
}

export interface Toast {
    id: string;
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
  border: 1px #1c222a;
  padding: 10px 20px;
  border-radius: 8px;
  filter: opacity(0.8);
  pointer-events: none;
  ${(props) => {
      switch (props.type) {
        case ToastType.ERROR:
            return css`
              background-color: ${colors['error']};
            `;
        case ToastType.INFO:
            return css`
              background-color: ${colors['info']};
            `;
        case ToastType.SUCCESS:
            return css`
              background-color: ${colors['success']};
            `;
        case ToastType.WARNING:
            return css`
              background-color: ${colors['warning']};
            `;
      }
  }}
`;
