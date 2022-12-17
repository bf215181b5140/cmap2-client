import { useEffect, useState } from 'react';
import { ClientData } from '../../shared/clientData';
import { ClientCredentials, SocketConnectionStatus } from '../../shared/global';
import { SocketConnectionState } from '../../shared/enums';

export default function useClientData(connectionStatus: SocketConnectionStatus, clientCredentials: ClientCredentials) {

    const [clientData, setClientData] = useState<ClientData | null>(null);

    useEffect(() => {
        if (connectionStatus.state === SocketConnectionState.CONNECTED) {
            console.log('useClientData CONNECTED');
            if (clientCredentials.username !== '') {
                fetch(clientCredentials.serverUrl + '/api/clientData/' + clientCredentials.username)
                    .then((response: Response) => {
                        console.log(response);
                        setClientData(null);
                    });
            }
        }
    }, [connectionStatus]);

    return clientData;
}
