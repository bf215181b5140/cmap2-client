import styled from 'styled-components';
import { useNotifications } from '../../hooks/useNotifications.hook';
import { NotificationType } from '../../../electron/store/notifications/notifications.model';
import { ReactProps } from '../../types';

interface NotificationProps extends ReactProps {
    type: NotificationType;
}

export default function SpanNotification({ type, children }: NotificationProps) {

    const { notificationColor, notificationIcon } = useNotifications();
    const icon = notificationIcon(type);
    const colors = notificationColor(type);

    return (<SpanNotificationStyled background={colors.background} border={colors.border}>
        <i className={icon} />
        {children}
    </SpanNotificationStyled>);
}

const SpanNotificationStyled = styled.div<{ background: string, border: string }>`
    margin: 8px 0;
    padding: 10px 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    border-radius: 8px;
    background: ${props => props.background};
    border: 1px solid ${props => props.border};

    i {
        font-size: 20px;
    }
`;