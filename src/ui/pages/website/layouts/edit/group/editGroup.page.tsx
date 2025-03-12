import GroupForm from './form/groupForm.component';
import { Page } from '../../../../../components/page/page.component';
import useEditPageItems from '../hooks/editPageItems.hook';
import EditPageMenu from '../menu/editPageMenu.component';

export default function EditGroupPage() {

  const { layout, group } = useEditPageItems();

  if (!layout) return;

  return (<Page flexDirection={'column'}>

    <EditPageMenu />

    <GroupForm layout={layout} group={group} />

  </Page>);
}