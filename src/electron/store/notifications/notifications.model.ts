import { Notification } from '../../../shared/objects/notification';

export interface NotificationsStoreData {
    notifications: Notification[];
}

export const notificationsStoreDefaults: NotificationsStoreData = {
    notifications: []
};
