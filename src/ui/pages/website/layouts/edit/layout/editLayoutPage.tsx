import LayoutForm from './form/layoutForm.component';
import ParameterBadges from './parameterBadges/parameterBadges.component';
import EditPageMenu from '../menu/editPageMenu.component';
import { Page } from '../../../../../components/page/page.component';
import useEditPageItems from '../hooks/editPageItems.hook';

export default function EditLayoutPage() {

  const { layout } = useEditPageItems();

  return (<Page flexDirection={'column'}>

    <EditPageMenu />

    <LayoutForm layout={layout} />
    {layout && <ParameterBadges layout={layout} />}

  </Page>);
}
