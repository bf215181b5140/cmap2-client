import { useEffect, useState } from 'react';
import { ClientCredentials } from '../../shared/global';

export default function useClientCredentials() {

    const [clientCredentials, setClientCredentials] = useState<ClientCredentials>({
        apiKey: '',
        username: '',
        serverUrl: ''
    });

    useEffect(() => {
        window.electronAPI.getClientCredentials()
            .then(result => {
                if (result != null) {
                    console.log('useClientCredentials hook recieved credentials: ', result);
                    setClientCredentials(result);
                }
            });
    }, []);

    return clientCredentials;
}
