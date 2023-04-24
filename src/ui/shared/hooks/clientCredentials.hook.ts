import React, { useEffect, useState } from 'react';
import { ClientCredentials } from '../../../shared/classes';

export interface ClientCredentialsHook {
    clientCredentials: ClientCredentials,
    setClientCredentials: React.Dispatch<React.SetStateAction<ClientCredentials>>,
    setClientToken: (token: string) => void,
}

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

    const setClientToken = (token: string) => {
        setClientCredentials({...clientCredentials, apiToken: token});
    };

    return {clientCredentials, setClientToken, setClientCredentials};
}
