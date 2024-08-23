import styled from 'styled-components';
import LovenseConnection from './components/lovenseConnection.component';
import VrcConnection from './components/vrcConnection.component';
import WebsiteConnection from './components/websiteConnection.component';
import Content from '../../shared/components/contentBox/content.component';
import ContentBox from '../../shared/components/contentBox/contentBox.component';

export default function LaunchPadPage() {

    return (<Content flexDirection="column">
        <ContentBox>
            <LaunchPadStyled>
                <VrcConnection />
                <WebsiteConnection />
                <LovenseConnection />
            </LaunchPadStyled>
        </ContentBox>
    </Content>);
}

const LaunchPadStyled = styled.div`
  margin: 25px auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 550px;
`;
