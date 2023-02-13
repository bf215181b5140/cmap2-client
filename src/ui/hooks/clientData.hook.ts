import { useEffect, useState } from 'react';
import { ClientData } from '../../shared/clientData';
import { ClientCredentials } from 'cmap2-shared';
import { ConnectionStatus, ConnectionStatusCode } from '../../shared/ConnectionStatus';

export default function useClientData(connectionStatus: ConnectionStatus, clientCredentials: ClientCredentials) {

    const [clientData, setClientData] = useState<ClientData | null>(null);

    useEffect(() => {
        if (connectionStatus.code === ConnectionStatusCode.CONNECTED) {
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
