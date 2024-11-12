import styled from 'styled-components';
import UpdateBox from './components/updateBox.component';
import useUpdateStatus from '../../hooks/updateStatus.hook';
import { Page } from '../../components/page/page.component';
import Segment from '../../components/segment/segment.component';

export default function UpdaterPage() {

    const { updateStatus, updateDetail, updateStatusColor, currentVersion, latest } = useUpdateStatus();

    return (<Page flexDirection={'row'}>
        <Segment width={'Half'}>
            <h2 style={{ color: updateStatusColor, marginTop: '0' }}>{updateStatus}</h2>

            {updateDetail && <p>{updateDetail}</p>}

            <p>Download and install available updates by clicking on them on the right side.</p>

            <h3>Current version</h3>
            <span style={{ display: 'block', margin: '5px' }}>{currentVersion}</span>
        </Segment>

        <Segment width={'Half'} segmentTitle={'Download and install'}>
            {latest ? (<>
                <UpdatesStyled>
                    <UpdateBox update={latest} />
                </UpdatesStyled>
            </>) : (<>
                <p>No new updates available</p>
            </>)}
        </Segment>
    </Page>);
}

const UpdatesStyled = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;
`;
