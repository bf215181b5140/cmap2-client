import { useEffect, useState } from 'react';
import { ContentBoxWidth } from 'cmap2-shared';
import timeSinceTimestamp from '../../../../shared/util/timeSinceTimestamp';
import useVrcConnection from '../../../../shared/hooks/vrcConnection.hook';
import ContentBox from '../../../../shared/components/contentBox/contentBox.component';

export default function VrcGameStatus() {

    const { vrcStatus, vrcStatusColor } = useVrcConnection();
    const [lastOscActivity, setLastOscActivity] = useState<number | null>(null);
    const [key, setKey] = useState(0);

    useEffect(() => {
        function getLastOscActivity() {
            window.IPC.get('getLastOscActivity').then(data => {
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
        <h2 style={{color: vrcStatusColor, marginTop: '0'}}>{vrcStatus}</h2>
        <p key={key}>{timeSinceTimestamp(lastOscActivity, 'Last OSC activity: ', 'No OSC activity detected')}</p>
    </ContentBox>);
}


