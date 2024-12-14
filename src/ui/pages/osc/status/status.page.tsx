import { Page } from '../../../components/page/page.component';

export default function StatusPage() {

  return (<Page flexDirection={'column'}>
    <VrcStatus>
      <OscStatus />
  </Page>);
}
