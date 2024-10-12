import React, { useContext } from 'react';
import styled from 'styled-components';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { ToastContext } from '../context/toast.context';
import { useNotifications } from '../../hooks/useNotifications.hook';

export function ToastComponent() {

  const [parent] = useAutoAnimate();
  const { toasts } = useContext(ToastContext);
  const { notificationColor, notificationIcon } = useNotifications();

  return (<ToastComponentStyled ref={parent}>
    {toasts.map(toast => (
      <ToastStyled key={toast.id} background={notificationColor(toast.type).background} border={notificationColor(toast.type).border}>
        <i className={notificationIcon(toast.type)} />
        {toast.message}
      </ToastStyled>
    ))}
  </ToastComponentStyled>);
}

const ToastComponentStyled = styled.div`
    position: absolute;
    bottom: 20px;
    left: 50px;
    right: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    pointer-events: none;
    z-index: 101;
`;

const ToastStyled = styled.div<{ background: string, border: string }>`
    margin: 0;
    padding: 10px 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    border-radius: 8px;
    background: ${props => props.background};
    border: 1px solid ${props => props.border};
    filter: opacity(0.90);
    pointer-events: none;
    min-width: 200px;
    max-width: 600px;

    i {
        font-size: 20px;
    }
`;
