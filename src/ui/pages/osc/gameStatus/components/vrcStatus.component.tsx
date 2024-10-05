import { useEffect, useState } from 'react';
import Segment from '../../../../components/segment/segment.component';
import useVrcDetector from '../../../../hooks/vrcDetector.hook';
import useCmapUtil from '../../../../hooks/cmapUtil.hook';

export default function VrcStatus() {

    const { vrcStatus, vrcStatusColor } = useVrcDetector();
    const { timeSinceTimestamp } = useCmapUtil();
    const [lastOscActivity, setLastOscActivity] = useState<number | undefined>();
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

    return (<Segment flexBasis={'Full'}>
        <h2 style={{ color: vrcStatusColor, marginTop: '0' }}>{vrcStatus}</h2>
        <p key={key}>{timeSinceTimestamp(lastOscActivity, 'Last OSC activity: ', 'No OSC activity detected')}</p>
    </Segment>);
}


