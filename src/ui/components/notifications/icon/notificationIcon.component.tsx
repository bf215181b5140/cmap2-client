import React from 'react';
import styled from 'styled-components';
import { useNotifications } from '../../../hooks/useNotifications.hook';
import { ReactProps } from '../../../types';
import { NotificationType } from 'cmap-shared';

interface NotificationIconProps extends ReactProps {
  type: NotificationType,
  message: string,
}

export default function NotificationIcon({ type, message, children }: NotificationIconProps) {

  const { notificationColor, notificationIcon } = useNotifications();

  return (<NotificationIconStyled color={notificationColor(type).border} title={message}>
    {children}
    <i className={notificationIcon(type)} />
  </NotificationIconStyled>);
}

const NotificationIconStyled = styled.span<{ color: string }>`
    cursor: help;

    i {
        font-size: 20px;
        color: ${props => props.color};
        margin-left: 5px;
    }
`;
