import styled from 'styled-components';
import { PageLayout } from '../../components/page/page.component';
import Segment from '../../components/segment/segment.component';
import VrcConnection from './components/vrcConnection.component';
import WebsiteConnection from './components/websiteConnection.component';

export default function LaunchPadPage() {

    return (<PageLayout flexDirection="column">
        <Segment>
            <LaunchPadStyled>
                <VrcConnection />
                <WebsiteConnection />
                {/* <LovenseConnection /> */}
            </LaunchPadStyled>
        </Segment>
    </PageLayout>);
}

const LaunchPadStyled = styled.div`
    margin: 25px auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 550px;
`;
