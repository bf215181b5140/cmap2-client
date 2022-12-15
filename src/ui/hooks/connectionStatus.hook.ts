import { useEffect, useState } from 'react';
import { SocketConnectionStatus } from '../../global';
import { SocketConnectionState } from '../../enums';

export default function useConnectionStatus() {

    const [connectionStatus, setConnectionStatus] = useState<SocketConnectionStatus>({
        state: SocketConnectionState.DISCONNECTED,
        message: 'Not connected',
        description: ''
    });

    useEffect(() => {
        window.electronAPI.getConnectionStatus().then(result => {
            setConnectionStatus(result);
            console.log(connectionStatus);
        })

        window.electronAPI.updateConnectionStatus((event: any, connectionStatus: SocketConnectionStatus) => {
            setConnectionStatus(connectionStatus);
            console.log(connectionStatus);
        });
    }, []);

    return connectionStatus;
}