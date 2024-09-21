export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export const notificationTypes: NotificationType[] = ['info', 'success', 'warning', 'error'];

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    group?: string;
    dateTime: string;
}

export interface NotificationsStoreData {
    notifications: Notification[];
}

export const notificationsStoreDefaults: NotificationsStoreData = {
    notifications: []
};
