import styled from 'styled-components';
import { Page } from '../../components/page/page.component';
import Segment from '../../components/segment/segment.component';
import VrcConnection from './components/vrcConnection.component';
import WebsiteConnection from './components/websiteConnection.component';

export default function LaunchPadPage() {

  return (<Page flexDirection={'column'}>
    <Segment>
      <LaunchPadStyled>
        <VrcConnection />
        <WebsiteConnection />
      </LaunchPadStyled>
    </Segment>
  </Page>);
}

const LaunchPadStyled = styled.div`
    margin: 25px auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 550px;
`;
