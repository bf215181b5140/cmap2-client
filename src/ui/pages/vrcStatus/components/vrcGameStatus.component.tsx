import { useEffect, useState } from 'react';
import { ContentBox } from 'cmap2-shared/dist/react';

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
        const activityInterval = setInterval(getLastOscActivity, 4500)

        return () => {
            if (removeListener) removeListener();
            if (activityInterval) clearInterval(activityInterval);
        }
    }, []);

    function lastOscActivityText(): string {
        if (lastOscActivity === null || lastOscActivity === 0) return 'No OSC activity detected';
        const diff = (Date.now() - lastOscActivity) / 1000;
        if (diff < 5) return 'Last OSC activity: just now';
        if (diff < 60) return `Last OSC activity: ${Math.floor(diff)} seconds ago`;
        if (diff < 120) return `Last OSC activity: ${Math.floor(diff / 60)} minute ago`;
        if (diff < 3600) return `Last OSC activity: ${Math.floor(diff / 60)} minutes ago`;
        return `Last OSC activity: ${Math.floor(diff / 3600)} hours ago`;
    }

    return (<ContentBox>
        <Header isVrchatRunning={isVrchatRunning}/>
        <p>{lastOscActivityText()}</p>
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


