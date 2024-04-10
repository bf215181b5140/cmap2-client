import { Content, ContentBox } from 'cmap2-shared/dist/react';
import useUpdateStatus from '../../shared/hooks/updateStatus.hook';
import ButtonInput from '../../shared/components/form/inputs/button.component';
import { useState } from 'react';
import FormControlBar from '../../shared/components/form/formControlBar.component';
import styled from 'styled-components';
import UpdateBox from './components/updateBox.component';
import UpdaterSettingsForm from './components/updaterSettingsForm.component';

export default function UpdaterPage() {

    const { updateStatus, updateDetail, updateStatusColor, currentVersion, lastCheck, updates } = useUpdateStatus();
    const [checkDisabled, setCheckDisabled] = useState(false);

    return (<Content flexDirection={'column'}>
        <ContentBox>
            <h2 style={{ color: updateStatusColor }}>{updateStatus}</h2>

            {updateDetail && <p>{updateDetail}</p>}

            {lastCheck && <>Last checked {new Date(Date.now() - lastCheck).getMinutes()} minutes ago.</>}

            <h3>Current version</h3>
            <span style={{ display: 'block', margin: '5px' }}>{currentVersion}</span>

            {updates.length > 0 && <>
                <h2>Latest available updates</h2>
                <UpdatesStyled>
                    {updates?.map((update, index) => (<UpdateBox update={update} latest={index === 0} key={update.id} />))}
                </UpdatesStyled>
            </>}


            <FormControlBar>
                <ButtonInput text={'Check for updates'} disabled={checkDisabled} onClick={() => {
                    window.electronAPI.send('checkForUpdate', true);
                    setCheckDisabled(true);
                    setTimeout(() => setCheckDisabled(false), 4000);
                }} />
            </FormControlBar>

        </ContentBox>

            <UpdaterSettingsForm />
    </Content>);
}

const UpdatesStyled = styled.div`
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;

  > div {
    flex-basis: calc(32.8% - (15px / 3));
  }
`;
