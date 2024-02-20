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
        if (diff < 60) return `${Math.floor(diff)} seconds ago`;
        if (diff < 120) return `${Math.floor(diff / 60)} minute ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
        return `${Math.floor(diff / 3600)} hours ago`;
    }

    return (<ConnectionBox icon={'ri-gamepad-line'} connected={isVrchatRunning === true} redirectPath={'/settings'}>
        <h1>Vrchat</h1>
        <Header isVrchatRunning={isVrchatRunning}/>
        <p>Last OSC activity: {lastOscActivityText()}</p>
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


