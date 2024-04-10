import CheckboxButton from '../../../shared/components/buttons/checkboxButton.component';
import { useEffect, useState } from 'react';
import { UpdaterSettings } from '../../../../../electron/updater/updater.model';
import { ContentBox } from 'cmap2-shared/dist/react';

export default function UpdaterSettingsForm() {

    const [updaterSettings, setUpdaterSettings] = useState<UpdaterSettings>();

    useEffect(() => {
        window.electronAPI.get('getUpdaterSettings').then(data => setUpdaterSettings(data));
    }, []);

    function onAutoCheckUpdates(autoCheckUpdates: boolean) {
        setUpdaterSettings({ autoCheckUpdates });
        window.electronAPI.send('setUpdaterSettings', { autoCheckUpdates });
    }

    return (<ContentBox>
        <h2>Settings</h2>
        Automatically check for updates
        <CheckboxButton value={!!updaterSettings?.autoCheckUpdates} onClick={onAutoCheckUpdates} />
    </ContentBox>);
}
