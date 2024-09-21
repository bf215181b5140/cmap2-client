import { useContext } from 'react';
import { Notification, NotificationType } from '../../electron/store/notifications/notifications.model';
import { nanoid } from 'nanoid';
import { ToastContext } from '../components/context/toast.context';

export function useNotifications() {

    const { toastsDispatch } = useContext(ToastContext);

    function addNotification(type: NotificationType, message: string, group?: string, showToast: boolean = true) {
        const notification: Notification = {
            id: nanoid(),
            type,
            message,
            group,
            dateTime: new Date().toLocaleString(),
        };
        window.IPC.send('saveNotification', notification);
        if (showToast) {
            toastsDispatch({
                type: 'add',
                toast: notification,
            });
        }
    }

    function notificationColor(type: NotificationType) {
        switch (type) {
            case 'info':
                return { background: '#284966', border: '#486D8B' };
            case 'success':
                return { background: '#29553B', border: '#4A795E' };
            case 'warning':
                return { background: '#905A2D', border: '#B87E4F' };
            case 'error':
            default:
                return { background: '#8D3F3F', border: '#B56161' };
        }
    }

    function notificationIcon(type: NotificationType) {
        switch (type) {
            case 'info':
                return 'ri-information-2-line';
            case 'success':
                return 'ri-checkbox-circle-line';
            case 'warning':
                return 'ri-alert-line';
            case 'error':
            default:
                return 'ri-spam-3-line';
        }
    }

    return { addNotification, notificationColor, notificationIcon };
}
