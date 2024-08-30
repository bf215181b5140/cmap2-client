import React from 'react';
import { ReactProps } from 'cmap2-shared';
import styled, { css } from 'styled-components';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Toast, ToastReducerAction, ToastType } from './toast.hook';

interface ToastProps extends ReactProps {
    toasts: Toast[];
    dispatch: (action: ToastReducerAction) => void;
}

export function ToastComponent(props: ToastProps) {

    const [parent] = useAutoAnimate();

    return (<ToastComponentStyled ref={parent}>
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
    z-index: 101;
`;

const ToastStyled = styled.div<{ type: ToastType }>`
    margin: 10px;
    background-color: ${props => props.theme.colors.ui.background3};
    border: 1px solid;
    padding: 10px 20px;
    border-radius: 8px;
    filter: opacity(0.9);
    pointer-events: none;

    ${(props) => {
        switch (props.type) {
            case ToastType.ERROR:
                return css`
                    border-color: ${props => props.theme.colors.error};
                `;
            case ToastType.INFO:
                return css`
                    border-color: ${props => props.theme.colors.info};
                `;
            case ToastType.SUCCESS:
                return css`
                    border-color: ${props => props.theme.colors.success};
                `;
            case ToastType.WARNING:
                return css`
                    border-color: ${props => props.theme.colors.warning};
                `;
            case ToastType.ATTENTION:
                return css`
                    border-color: ${props => props.theme.colors.attention};
                `;
        }
    }}
`;
