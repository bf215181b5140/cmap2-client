import { Page } from '../../../components/page/page.component';
import VrcStatus from './vrcStatus/vrcStatus.component';
import TrackedParameters from './trackedParameters/trackedParameters.component';

export default function GameStatusPage() {

    return(<Page flexDirection={'column'}>
        <VrcStatus />
        <TrackedParameters />
    </Page>);
}
