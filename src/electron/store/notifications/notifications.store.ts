import CmapStore from '../cmapStore';
import { IPC } from '../../ipc/typedIpc.service';
import { NotificationsStoreData, notificationsStoreDefaults } from './notifications.model';

export class NotificationsStore extends CmapStore<NotificationsStoreData> {

  constructor() {
    super({
      name: 'notifications',
      defaults: notificationsStoreDefaults
    });

    IPC.handle('getNotifications', async () => this.get('notifications'));
    IPC.on('saveNotification', notification => this.set('notifications', [...this.get('notifications'), notification]));
    IPC.on('deleteNotification', notification => this.set('notifications', this.get('notifications').filter(n => n.id !== notification.id)));
    IPC.on('clearNotifications', () => this.set('notifications', []));
  }
}
