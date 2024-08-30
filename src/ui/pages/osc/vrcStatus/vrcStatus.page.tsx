import { Page } from '../../../components/page/page.component';
import Segment from '../../../components/segment/segment.component';

export default function VrcStatusPage() {

    return(<Page flexDirection={'column'}>
        <Segment segmentTitle={'Vrc Status'} />
        <Segment toggleTitle={'Vrc Status'} />
        <Segment segmentTitle={'Vrc Status'} />
        {/* <VrcGameStatus /> */}
        {/* <VrcOscStatus /> */}
        {/* <VrcOscHistory /> */}
    </Page>);
}
