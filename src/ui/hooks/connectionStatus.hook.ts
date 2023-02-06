import { useEffect, useState } from 'react';
import { ConnectionStatus, ConnectionStatusCode } from '../../shared/ConnectionStatus';

export default function useConnectionStatus() {

    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(new ConnectionStatus(ConnectionStatusCode.DISCONNECTED));

    useEffect(() => {
        window.electronAPI.getConnectionStatus().then(result => {
            setConnectionStatus(result);
        })

        window.electronAPI.updateConnectionStatus((event: any, connectionStatus: ConnectionStatus) => {
            setConnectionStatus(connectionStatus);
        });
    }, []);

    return connectionStatus;
}
