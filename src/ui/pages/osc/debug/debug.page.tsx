import { Page } from '../../../components/page/page.component';
import OscHistory from './oscHistory/oscHistory.component';

export default function DebugPage() {

    return(<Page flexDirection={'column'}>
        <OscHistory />
    </Page>);
}
