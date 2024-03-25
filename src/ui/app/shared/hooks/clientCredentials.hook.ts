import React, { useEffect, useState } from 'react';
import { ClientCredentials } from '../../../../shared/classes';
import { LoginTokenDTO } from 'cmap2-shared';

export interface ClientCredentialsHook {
    clientCredentials: ClientCredentials,
    setClientCredentials: (credentials: ClientCredentials) => void,
    setClientToken: (token: LoginTokenDTO) => void,
    clearClientToken: () => void,
}

export default function useClientCredentials(): ClientCredentialsHook {

    const [clientCredentials, setClientCredentialsInternal] = useState<ClientCredentials>(new ClientCredentials());

    useEffect(() => {
        window.electronAPI.get('getClientCredentials')
            .then(result => {
                if (result != null) {
                    setClientCredentialsInternal(result);
                }
            });
    }, []);

    function setClientCredentials(credentials: ClientCredentials) {
        setClientCredentialsInternal({...credentials});
        window.electronAPI.send('setClientCredentials', {...credentials});
    }

    function setClientToken(token: LoginTokenDTO) {
        const newCredentials = {...clientCredentials, apiToken: token.apiToken, displayName: token.displayName};
        setClientCredentials(newCredentials);
        window.electronAPI.send('setClientCredentials', newCredentials);
    }

    function clearClientToken() {
        const newCredentials = {...clientCredentials, apiToken: null, displayName: null};
        setClientCredentials(newCredentials);
        window.electronAPI.send('setClientCredentials', newCredentials);
    }

    return {clientCredentials, setClientCredentials, setClientToken, clearClientToken};
}
