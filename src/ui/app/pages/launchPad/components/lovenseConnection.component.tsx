import { useEffect, useState } from 'react';
import { LovenseStatus } from '../../../../../shared/lovense';
import ConnectionBox from './connectionBox.component';

export default function LovenseConnection() {

    const [lovenseStatus, setLovenseStatus] = useState<LovenseStatus>(new LovenseStatus());

    useEffect(() => {
        window.electronAPI.send('getLovenseStatus');

        const removeListener = window.electronAPI.receive('lovenseStatus', (lovenseStatus: LovenseStatus) => setLovenseStatus(lovenseStatus));

        return () => {
            if (removeListener) removeListener();
        }
    }, []);

    return (
        <ConnectionBox icon={'ri-wireless-charging-fill'} connected={lovenseStatus.socketConnection && lovenseStatus.status === 1} redirectPath={'/lovense'}>
            <h1>Lovense</h1>
            <Header lovenseStatus={lovenseStatus} />
        </ConnectionBox>);
}

function Header({ lovenseStatus }: { lovenseStatus: LovenseStatus }) {
    if (lovenseStatus.socketConnection) {
        if (lovenseStatus.status === 1) {
            return (<h2 style={{color: 'seagreen'}}>Connected</h2>);
        }
        return (<h2 style={{color: 'orange'}}>Connecting...</h2>);
    }
    return (<h2 style={{color: 'indianred'}}>Not connected</h2>);
}
