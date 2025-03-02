import Drawer from '../drawer.component';
import { useEffect, useState } from 'react';
import { Notification } from '../../../../shared/objects/notification';
import DrawerItem from '../drawerItem.component';

export default function NotificationDrawer() {

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    window.IPC.get('getNotifications').then(notifications => setNotifications(notifications.reverse()));
  }, []);


  return (<Drawer icon={'ri-discuss-line'} title={'Recent notifications'} emptyMessage={'No new notifications'}>
    {notifications.slice(0, 30).map(notification => (
      <DrawerItem notificationType={notification.type} key={notification.id}>
        <p style={{margin: 0, padding: 0}}>{notification.message}</p>
      </DrawerItem>
    ))}
  </Drawer>);
}