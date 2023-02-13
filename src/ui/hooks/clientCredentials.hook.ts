import { useEffect, useState } from 'react';
import { ClientCredentials } from 'cmap2-shared';

export default function useClientCredentials() {

    const [clientCredentials, setClientCredentials] = useState<ClientCredentials>(new ClientCredentials());

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
