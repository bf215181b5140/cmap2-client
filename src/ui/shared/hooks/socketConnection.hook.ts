import { useEffect, useState } from 'react';
import { SocketConnection } from '../../../shared/SocketConnection';

export default function useSocketConnection() {

    const [socketConnectionStatus, setSocketConnectionStatus] = useState<SocketConnection>(new SocketConnection());

    useEffect(() => {
        window.electronAPI.getConnectionStatus().then(result => {
            setSocketConnectionStatus(result);
        })

        window.electronAPI.updateConnectionStatus((event: any, connectionStatus: SocketConnection) => {
            setSocketConnectionStatus(connectionStatus);
        });
    }, []);

    return socketConnectionStatus;
}
