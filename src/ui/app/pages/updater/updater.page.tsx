import { Content, ContentBox } from 'cmap2-shared/dist/react';
import { useEffect, useState } from 'react';
import { app } from 'electron';
import semver from 'semver';

export default function UpdaterPage() {

    const [lastestVersion, setLatestVersion] = useState<string | undefined>();
    const currentVersion = app.getVersion();
    const isUpToDate = lastestVersion && currentVersion ? semver.lte(lastestVersion, currentVersion) : null;

    useEffect(() => {
        window.electronAPI.get('latestClientVersion').then(data => setLatestVersion(data));
    }, []);

    function onUpdate() {
        window.electronAPI.send('startUpdate');
    }

    return(<Content>
        <ContentBox>
            <h2>Updater page</h2>
            Current version: {app.getVersion()}
        </ContentBox>
    </Content>)
}
