import { useEffect, useState } from 'react';
import { SocketConnection } from '../../../../shared/SocketConnection';

export default function useSocketConnection() {

    const [socketConnectionStatus, setSocketConnectionStatus] = useState<SocketConnection>(new SocketConnection());

    useEffect(() => {
        window.electronAPI.get('getConnectionStatus').then(result => {
            setSocketConnectionStatus(result);
        })

        const removeListener = window.electronAPI.receive('updateConnectionStatus', (connectionStatus: SocketConnection) => setSocketConnectionStatus(connectionStatus));

        return () => {
            if (removeListener) removeListener();
        }
    }, []);

    return socketConnectionStatus;
}
