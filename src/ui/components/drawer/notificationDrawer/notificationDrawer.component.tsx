import Drawer from '../drawer.component';
import { useContext } from 'react';
import DrawerItem from '../drawerItem.component';
import { ToastContext } from '../../context/toast.context';

export default function NotificationDrawer() {

  const { toastHistory } = useContext(ToastContext);

  return (<Drawer icon={'ri-discuss-line'} title={'Recent notifications'} emptyMessage={'No new notifications'}>
    {toastHistory.slice(0, 30).map(notification => (
      <DrawerItem notificationType={notification.type} key={notification.id}>
        <p style={{margin: 0, padding: 0}}>{notification.message}</p>
      </DrawerItem>
    ))}
  </Drawer>);
}