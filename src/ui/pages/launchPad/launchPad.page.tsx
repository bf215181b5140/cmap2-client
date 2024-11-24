import { Page } from '../../components/page/page.component';
import WebsiteConnection from './website/website.segment';
import Status from './status/status.component';

export default function LaunchPadPage() {

  return (<Page flexDirection={'row'}>
    <Status />
    <WebsiteConnection />
  </Page>);
}
