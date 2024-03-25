import { useEffect, useState } from 'react';
import { ContentBox } from 'cmap2-shared/dist/react';
import { ContentBoxWidth, theme } from 'cmap2-shared';
import timeSinceTimestamp from '../../../../shared/util/timeSinceTimestamp';
import useVrcConnection from '../../../../shared/hooks/vrcConnection.hook';

export default function VrcGameStatus() {

    const { vrcStatus, vrcStatusColor } = useVrcConnection();
    const [lastOscActivity, setLastOscActivity] = useState<number | null>(null);
    const [key, setKey] = useState(0);

    useEffect(() => {
        function getLastOscActivity() {
            window.electronAPI.get('getLastOscActivity').then(data => {
                setLastOscActivity(data);
                // set key state to force a re-render for osc activity text if lastOscActivity number doesn't change
                setKey(state => state + 1);
            });
        }

        getLastOscActivity();
        const activityInterval = setInterval(getLastOscActivity, 1000);

        return () => {
            if (activityInterval) clearInterval(activityInterval);
        };
    }, []);

    return (<ContentBox flexBasis={ContentBoxWidth.Full}>
        <h2 style={{color: vrcStatusColor}}>{vrcStatus}</h2>
        <p key={key}>{timeSinceTimestamp(lastOscActivity, 'Last OSC activity: ', 'No OSC activity detected')}</p>
    </ContentBox>);
}


