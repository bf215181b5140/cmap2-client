import { Content } from 'cmap2-shared/dist/react';
import VrcGameStatus from './components/vrcGameStatus.component';
import VrcOscStatus from './components/vrcOscStatus.component';
import VrcOscHistory from './components/vrcOscHistory.component';

export default function VrcStatusPage() {

    return(<Content>

        <VrcGameStatus />

        <VrcOscStatus />

        <VrcOscHistory />

    </Content>);
}
