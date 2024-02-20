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

    return (<ConnectionBox icon={'ri-global-line'} connected={socketConnection?.type === SocketConnectionType.SUCCESS} redirectPath={'/profile'}>
        <h1>Website</h1>
        <Header socketConnection={socketConnection} />
        {socketConnection?.message && <p>{socketConnection.message}</p>}
    </ConnectionBox>);
}

function Header({ socketConnection }: { socketConnection: SocketConnection | null }) {
    if (socketConnection === null) {
        return (<h2/>);
    }
    if (socketConnection.type === SocketConnectionType.SUCCESS) {
        return (<h2 style={{color: 'green'}}>Connected</h2>);
    }
    if (socketConnection.type === SocketConnectionType.MESSAGE) {
        return (<h2 style={{color: 'orange'}}>Connecting...</h2>);
    }
    if (socketConnection.type === SocketConnectionType.ERROR) {
        return (<h2 style={{color: 'darkred'}}>Not connected</h2>);
    }
    return (<h2/>);
}

