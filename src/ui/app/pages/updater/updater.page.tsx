import { Content, ContentBox } from 'cmap2-shared/dist/react';
import { app } from 'electron';
import useUpdateStatus from '../../shared/hooks/updateStatus.hook';
import ButtonInput from '../../shared/components/form/inputs/button.component';

export default function UpdaterPage() {

    const { updateStatus, updateDetail, updateStatusColor, currentVersion, serverVersion, newestVersion, newestDownload } = useUpdateStatus();

    function onUpdate() {
        window.electronAPI.send('startUpdate');
    }

    return (<Content>
        <ContentBox>
            <h2 style={{color: updateStatusColor}}>{updateStatus}</h2>
            {updateDetail && <p>{updateDetail}</p>}
            Current version: {currentVersion}
            Server version: {serverVersion}

            <hr />
            <ButtonInput text={'Check for updates'} onClick={() => window.electronAPI.send('checkForUpdate')} />
        </ContentBox>
    </Content>);
}
