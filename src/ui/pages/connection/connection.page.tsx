import styled from 'styled-components';
import { Content, ContentBox } from 'cmap2-shared/dist/react';
import LovenseConnection from './components/lovenseConnection.component';
import VrcConnection from './components/vrcConnection.component';
import WebsiteConnection from './components/websiteConnection.component';

export default function ConnectionPage() {

    return (<Content flexDirection="column">
        <ContentBox>
            <ConnectionPageStyled>
                <VrcConnection />
                <WebsiteConnection />
                <LovenseConnection />
            </ConnectionPageStyled>
        </ContentBox>
    </Content>);
}

const ConnectionPageStyled = styled.div`
  margin: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
