import { useContext } from 'react';
import { Notification } from '../../shared/objects/notification';
import { nanoid } from 'nanoid';
import { ToastContext } from '../components/context/toast.context';
import { NotificationType, NotificationTypeSchema } from 'cmap-shared';

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
    if (options?.showToast !== false) {
      toastsDispatch({
        type: 'add',
        toast: notification,
      });
    }
  }

  function notificationColor(type: NotificationType) {
    switch (type) {
      case NotificationTypeSchema.Enum.Info:
        return { background: '#284966', border: '#486D8B' };
      case NotificationTypeSchema.Enum.Success:
        return { background: '#29553B', border: '#4A795E' };
      case NotificationTypeSchema.Enum.Warning:
        return { background: '#905A2D', border: '#B87E4F' };
      case NotificationTypeSchema.Enum.Error:
      default:
        return { background: '#8D3F3F', border: '#B56161' };
    }
  }

  function notificationIcon(type: NotificationType) {
    switch (type) {
      case NotificationTypeSchema.Enum.Info:
        return 'ri-information-2-line';
      case NotificationTypeSchema.Enum.Success:
        return 'ri-checkbox-circle-line';
      case NotificationTypeSchema.Enum.Warning:
        return 'ri-alert-line';
      case NotificationTypeSchema.Enum.Error:
      default:
        return 'ri-spam-3-line';
    }
  }

  return { addNotification, notificationColor, notificationIcon };
}
