import VrcGameStatus from './components/vrcGameStatus.component';
import VrcOscStatus from './components/vrcOscStatus.component';
import VrcOscHistory from './components/vrcOscHistory.component';
import Content from '../../../shared/components/contentBox/content.component';

export default function VrcStatusPage() {

    return(<Content flexDirection={'row'}>
        <VrcGameStatus />
        <VrcOscStatus />
        <VrcOscHistory />
    </Content>);
}
