import { Page } from '../../../components/page/page.component';
import VrcStatus from './components/vrcStatus.component';
import OscStatus from './components/oscStatus.component';

export default function GameStatusPage() {

    return(<Page flexDirection={'column'}>
        <VrcStatus />
        <OscStatus />
    </Page>);
}
