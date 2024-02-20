import ConnectionBox from './connectionBox.component';
import { useEffect, useState } from 'react';

export default function VrcConnection() {

    const [isVrchatRunning, setIsVrchatRunning] = useState<boolean | null>(null);
    const [lastOscActivity, setLastOscActivity] = useState<number | null>(null);

    useEffect(() => {
        window.electronAPI.send('getIsVrchatRunning');
        const removeListener = window.electronAPI.receive('isVrchatRunning', (data) => setIsVrchatRunning(data));

        const activityInterval = setInterval(() => {
            window.electronAPI.get('getLastOscActivity').then(data => setLastOscActivity(data));
        }, 4500)

        return () => {
            if (removeListener) removeListener();
            if (activityInterval) clearInterval(activityInterval);
        }
    }, []);

    function lastOscActivityText(): string {
        if (lastOscActivity === null || lastOscActivity === 0) return 'No OSC activity detected';
        const diff = (Date.now() - lastOscActivity) / 1000;
        if (diff < 5) return 'just now';
        if (diff < 60) return `${Math.round(diff)} seconds ago`;
        if (diff < 3600) return `${Math.round(diff / 60)} minutes ago`;
        return `${Math.round(diff / 3600)} hours ago`;
    }

    return (<ConnectionBox icon={'ri-gamepad-line'} connected={isVrchatRunning === true} redirectPath={'/settings'}>
        <Header isVrchatRunning={isVrchatRunning}/>
        <p>Last OSC activity: {lastOscActivityText()}</p>
    </ConnectionBox>);
}

function Header({ isVrchatRunning }: { isVrchatRunning: boolean | null }) {
    if (isVrchatRunning === null) {
        return (<h1 style={{color: 'grey'}}>Not tracking if Vrchar is running</h1>);
    }
    if (isVrchatRunning) {
        return (<h1 style={{color: 'green'}}>Vrchar is running</h1>);
    } else {
        return (<h1 style={{color: 'darkred'}}>Vrchar is not running</h1>);
    }
}


