import { Page } from '../../../components/page/page.component';
import OscHistory from './oscHistory/oscHistory.component';
import SendParameter from './sendParameter/sendParameter.component';

export default function DebugPage() {

  return (<Page flexDirection={'column'}>
    <SendParameter />
    <OscHistory />
  </Page>);
}
