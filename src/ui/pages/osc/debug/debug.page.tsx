import { Page } from '../../../components/page/page.component';
import OscHistory from './oscHistory/oscHistory.component';
import SendParameter from './sendParameter/sendParameter.component';
import TrackedParameters from './trackedParameters/trackedParameters.component';

export default function DebugPage() {

  return (<Page flexDirection={'row'}>
    <SendParameter />
    <TrackedParameters />
    <OscHistory />
  </Page>);
}
