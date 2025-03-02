import Drawer from '../drawer.component';
import useUpdateStatus from '../../../hooks/updateStatus.hook';

export default function UpdateDrawer() {

  const { updateSeverity } = useUpdateStatus();

  return (<Drawer icon={'ri-download-2-fill'} title={'Updates'} emptyMessage={'No new updates.'} notificationType={updateSeverity}>
    </Drawer>);
}