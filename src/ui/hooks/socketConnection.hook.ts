import { useEffect, useState } from 'react';
import { SocketConnectionStatus, SocketConnectionStatusCode } from '../../shared/SocketConnectionStatus';

export default function useSocketConnection() {

    const [socketConnectionStatus, setSocketConnectionStatus] = useState<SocketConnectionStatus>(new SocketConnectionStatus(SocketConnectionStatusCode.DISCONNECTED));

    useEffect(() => {
        window.electronAPI.getConnectionStatus().then(result => {
            setSocketConnectionStatus(result);
        })

        window.electronAPI.updateConnectionStatus((event: any, connectionStatus: SocketConnectionStatus) => {
            setSocketConnectionStatus(connectionStatus);
        });
    }, []);

    return socketConnectionStatus;
}
