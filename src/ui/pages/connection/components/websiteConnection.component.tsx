import ConnectionBox from './connectionBox.component';
import { useEffect, useState } from 'react';
import { SocketConnection, SocketConnectionType } from '../../../../shared/SocketConnection';

export default function WebsiteConnection() {

    const [socketConnection, setSocketConnection] = useState<SocketConnection | null>(null);

    useEffect(() => {
        window.electronAPI.get('getConnectionStatus').then(data => setSocketConnection(data));

        const removeListener = window.electronAPI.receive('updateConnectionStatus', (data) => setSocketConnection(data));

        return () => {
            if (removeListener) removeListener();
        }
    }, []);

    return (<ConnectionBox icon={'ri-gamepad-line'} connected={socketConnection?.type === SocketConnectionType.SUCCESS} redirectPath={'/profile'}>
        <Header socketConnection={socketConnection} />
        {socketConnection?.message && <p>{socketConnection.message}</p>}
    </ConnectionBox>);
}

function Header({ socketConnection }: { socketConnection: SocketConnection | null }) {
    if (socketConnection === null) {
        return (<h1/>);
    }
    if (socketConnection.type === SocketConnectionType.SUCCESS) {
        return (<h1 style={{color: 'green'}}>Connected</h1>);
    }
    if (socketConnection.type === SocketConnectionType.MESSAGE) {
        return (<h1 style={{color: 'orange'}}>Connecting...</h1>);
    }
    if (socketConnection.type === SocketConnectionType.ERROR) {
        return (<h1 style={{color: 'darkred'}}>Not connected</h1>);
    }
    return (<h1/>);
}

