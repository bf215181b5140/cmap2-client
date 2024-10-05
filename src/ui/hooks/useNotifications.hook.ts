import { useContext } from 'react';
import { Notification } from '../../shared/objects/notification';
import { nanoid } from 'nanoid';
import { ToastContext } from '../components/context/toast.context';
import { NotificationType } from 'cmap2-shared';

interface AddNotificationOptions {
    id?: string;
    group?: string;
    showToast?: boolean;
}

export function useNotifications() {

    const { toastsDispatch } = useContext(ToastContext);

    function addNotification(type: NotificationType, message: string, options?: AddNotificationOptions) {
        const notification: Notification = {
            id: options?.id ?? nanoid(8),
            type,
            message,
            group: options?.group,
            dateTime: new Date().toLocaleString(),
        };
        window.IPC.send('saveNotification', notification);
        if (options?.showToast !== false) {
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
