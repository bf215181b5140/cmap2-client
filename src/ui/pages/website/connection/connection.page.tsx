import { Page } from '../../../components/page/page.component';
import AccountSegment from './account/account.segment';
import WebsocketStatusSegment from './websocketStatus/websocketStatus.segment';

export default function ConnectionPage() {

    return (<Page flexDirection={'row'}>
        <WebsocketStatusSegment />
        <AccountSegment />
    </Page>);
}

