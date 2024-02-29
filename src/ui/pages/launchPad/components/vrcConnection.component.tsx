import ConnectionBox from './connectionBox.component';
import { useEffect, useState } from 'react';
import timeSinceTimestamp from '../../../shared/util/timeSinceTimestamp';

export default function VrcConnection() {

    const [isVrchatRunning, setIsVrchatRunning] = useState<boolean | null>(null);
    const [lastOscActivity, setLastOscActivity] = useState<number | null>(null);

    useEffect(() => {
        window.electronAPI.send('getIsVrchatRunning');
        const removeListener = window.electronAPI.receive('isVrchatRunning', (data) => setIsVrchatRunning(data));

        function getLastOscActivity() {
            window.electronAPI.get('getLastOscActivity').then(data => setLastOscActivity(data));
        }

        getLastOscActivity();
        const activityInterval = setInterval(getLastOscActivity, 4500)

        return () => {
            if (removeListener) removeListener();
            if (activityInterval) clearInterval(activityInterval);
        }
    }, []);

    return (<ConnectionBox icon={'ri-gamepad-line'} connected={isVrchatRunning === true} redirectPath={'/vrcStatus'}>
        <h1>Vrchat</h1>
        <Header isVrchatRunning={isVrchatRunning}/>
        <p>{timeSinceTimestamp(lastOscActivity, 'Last OSC activity: ', 'No OSC activity detected')}</p>
    </ConnectionBox>);
}

function Header({ isVrchatRunning }: { isVrchatRunning: boolean | null }) {
    if (isVrchatRunning === null) {
        return (<h2 style={{color: 'grey'}}>Not tracking if Vrchar is running</h2>);
    }
    if (isVrchatRunning) {
        return (<h2 style={{color: 'seagreen'}}>Vrchar is running</h2>);
    } else {
        return (<h2 style={{color: 'indianred'}}>Vrchar is not running</h2>);
    }
}


