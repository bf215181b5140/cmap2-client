import styled from 'styled-components';
import { Content, ContentBox } from 'cmap2-shared/dist/react';
import LovenseConnection from './components/lovenseConnection.component';
import VrcConnection from './components/vrcConnection.component';

export default function ConnectionPage() {

    return (<Content flexDirection="column">
        <ContentBox>
            <ConnectionPageStyled>
                <VrcConnection />
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
