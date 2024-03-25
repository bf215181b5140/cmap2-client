import ConnectionBox from './connectionBox.component';
import { useEffect, useState } from 'react';
import timeSinceTimestamp from '../../../shared/util/timeSinceTimestamp';
import useVrcConnection from '../../../shared/hooks/vrcConnection.hook';

export default function VrcConnection() {

    const { isVrcRunning, vrcStatus, vrcStatusColor } = useVrcConnection();
    const [lastOscActivity, setLastOscActivity] = useState<number | null>(null);

    useEffect(() => {
        function getLastOscActivity() {
            window.electronAPI.get('getLastOscActivity').then(data => setLastOscActivity(data));
        }

        getLastOscActivity();
        const activityInterval = setInterval(getLastOscActivity, 4500)

        return () => {
            if (activityInterval) clearInterval(activityInterval);
        }
    }, []);

    return (<ConnectionBox icon={'ri-gamepad-line'} connected={isVrcRunning === true} redirectPath={'/osc'}>
        <h1>VRChat</h1>
        <h2 style={{color: vrcStatusColor}}>{vrcStatus}</h2>
        <p>{timeSinceTimestamp(lastOscActivity, 'Last OSC activity: ', 'No OSC activity detected')}</p>
    </ConnectionBox>);
}


