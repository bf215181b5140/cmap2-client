import ConnectionBox from './launchPadBox.component';
import { useEffect, useState } from 'react';
import timeSinceTimestamp from '../../../util/timeSinceTimestamp';
import useVrcDetector from '../../../hooks/vrcDetector.hook';

export default function VrcConnection() {

    const { isVrcDetected, vrcStatus, vrcStatusColor } = useVrcDetector();
    const [lastOscActivity, setLastOscActivity] = useState<number | null>(null);

    useEffect(() => {
        // function getLastOscActivity() {
        //     window.IPC.get('getLastOscActivity').then(data => setLastOscActivity(data));
        // }
        //
        // getLastOscActivity();
        // const activityInterval = setInterval(getLastOscActivity, 4500);
        //
        // return () => {
        //     if (activityInterval) clearInterval(activityInterval);
        // };
    }, []);

    return (<ConnectionBox icon={'ri-gamepad-line'} connected={isVrcDetected === true} redirectPath={'/osc'}>
        <h1>VRChat</h1>
        <h2 style={{ color: vrcStatusColor }}>{vrcStatus}</h2>
        <p>{timeSinceTimestamp(lastOscActivity, 'Last OSC activity: ', 'No OSC activity detected')}</p>
    </ConnectionBox>);
}


