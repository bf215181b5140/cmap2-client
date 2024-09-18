import { Page } from '../../../components/page/page.component';
import Segment from '../../../components/segment/segment.component';
import VrcStatus from './components/vrcStatus.component';
import OscStatus from './components/oscStatus.component';
import OscHistory from './components/oscHistory.component';

export default function GameStatusPage() {

    return(<Page flexDirection={'column'}>
        <VrcStatus />
        <OscStatus />
        <OscHistory />
    </Page>);
}
