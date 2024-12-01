import { Page } from '../../../components/page/page.component';
import TrackedParameters from './trackedParameters/trackedParameters.component';

export default function GameStatusPage() {

  return (<Page flexDirection={'column'}>
    <TrackedParameters />
  </Page>);
}
