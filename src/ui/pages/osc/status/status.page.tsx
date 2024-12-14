import { Page } from '../../../components/page/page.component';
import VrcStatus from './vrcStatus/vrcStatus.component';
import OscStatus from './oscStatus/oscStatus.component';

export default function StatusPage() {

  return (<Page flexDirection={'column'}>
    <VrcStatus />
    <OscStatus />
  </Page>);
}
