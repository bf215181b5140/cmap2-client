import { Content, ContentBox } from 'cmap2-shared/dist/react';
import useUpdateStatus from '../../shared/hooks/updateStatus.hook';
import styled from 'styled-components';
import UpdateBox from './components/updateBox.component';

export default function UpdaterPage() {

    const { updateStatus, updateDetail, updateStatusColor, currentVersion, updates } = useUpdateStatus();

    return (<Content flexDirection={'row'}>
        <ContentBox>
            <h2 style={{ color: updateStatusColor }}>{updateStatus}</h2>

            <p>Download and install available updates by clicking on them on the right side.</p>

            {updateDetail && <p>{updateDetail}</p>}

            <h3>Current version</h3>
            <span style={{ display: 'block', margin: '5px' }}>{currentVersion}</span>
        </ContentBox>

        <ContentBox>
            <h2>Download and install</h2>
            {updates.length > 0 ? (<>
                <UpdatesStyled>
                    {updates?.map((update, index) => (<UpdateBox update={update} latest={index === 0} key={update.id} />))}
                </UpdatesStyled>
            </>) : (<>
                <p>No new updates available</p>
            </>)}
        </ContentBox>
    </Content>);
}

const UpdatesStyled = styled.div`
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;
`;
