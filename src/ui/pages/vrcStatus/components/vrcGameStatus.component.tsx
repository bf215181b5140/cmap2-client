import { useEffect, useState } from 'react';
import { ContentBox } from 'cmap2-shared/dist/react';
import { ContentBoxWidth } from 'cmap2-shared';
import timeSinceTimestamp from '../../../shared/util/timeSinceTimestamp';

export default function VrcGameStatus() {

    const [isVrchatRunning, setIsVrchatRunning] = useState<boolean | null>(null);
    const [lastOscActivity, setLastOscActivity] = useState<number | null>(null);

    useEffect(() => {
        window.electronAPI.send('getIsVrchatRunning');
        const removeListener = window.electronAPI.receive('isVrchatRunning', (data) => setIsVrchatRunning(data));

        function getLastOscActivity() {
            window.electronAPI.get('getLastOscActivity').then(data => setLastOscActivity(data));
        }

        getLastOscActivity();
        const activityInterval = setInterval(getLastOscActivity, 1000)

        return () => {
            if (removeListener) removeListener();
            if (activityInterval) clearInterval(activityInterval);
        }
    }, []);

    return (<ContentBox flexBasis={ContentBoxWidth.Full}>
        <Header isVrchatRunning={isVrchatRunning}/>
        <p>{timeSinceTimestamp(lastOscActivity, 'Last OSC activity: ', 'No OSC activity detected')}</p>
    </ContentBox>);
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


