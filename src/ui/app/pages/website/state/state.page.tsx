import Content from '../../../shared/components/contentBox/content.component';
import WebsiteState from './websiteState/websiteState.component';

export default function StatePage() {

    return (<Content flexDirection={'row'}>
        <WebsiteState />
    </Content>);
}
