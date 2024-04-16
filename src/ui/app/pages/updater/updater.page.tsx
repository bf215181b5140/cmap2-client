import { Content, ContentBox } from 'cmap2-shared/dist/react';
import useUpdateStatus from '../../shared/hooks/updateStatus.hook';
import styled from 'styled-components';
import UpdateBox from './components/updateBox.component';

export default function UpdaterPage() {

    const { updateStatus, updateDetail, updateStatusColor, currentVersion, latest } = useUpdateStatus();

    return (<Content flexDirection={'row'}>
        <ContentBox>
            <h2 style={{ color: updateStatusColor }}>{updateStatus}</h2>

            {updateDetail && <p>{updateDetail}</p>}

            <p>Download and install available updates by clicking on them on the right side.</p>

            <h3>Current version</h3>
            <span style={{ display: 'block', margin: '5px' }}>{currentVersion}</span>
        </ContentBox>

        <ContentBox>
            <h2>Download and install</h2>
            {latest ? (<>
                <UpdatesStyled>
                    <UpdateBox update={latest} />
                </UpdatesStyled>
            </>) : (<>
                <p>No new updates available</p>
            </>)}
        </ContentBox>
    </Content>);
}

const UpdatesStyled = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;
`;
