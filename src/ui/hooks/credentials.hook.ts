import { LoginTokenDTO } from 'cmap2-shared';
import { useEffect, useState } from 'react';
import { Credentials } from '../../shared/types';

export default function useCredentials() {

    const [credentials, setCredentialsInternal] = useState<Credentials>(new Credentials());

    useEffect(() => {
        window.IPC.get('getCredentials').then(result => setCredentialsInternal(result));
    }, []);

    function setCredentials(credentials: Credentials) {
        const newCredentials = { ...credentials };
        setCredentialsInternal(newCredentials);
        window.IPC.send('setCredentials', newCredentials);
    }

    function setLoginToken(token: LoginTokenDTO) {
        const newCredentials = { ...credentials, apiToken: token.apiToken, displayName: token.displayName };
        setCredentials(newCredentials);
        window.IPC.send('setCredentials', newCredentials);
    }

    function clearLoginToken() {
        const newCredentials = { ...credentials, apiToken: null, displayName: null };
        setCredentials(newCredentials);
        window.IPC.send('setCredentials', newCredentials);
    }

    return { credentials, setCredentials, setLoginToken, clearLoginToken };
}
