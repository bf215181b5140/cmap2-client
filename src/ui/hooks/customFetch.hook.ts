import { useContext } from 'react';
import { ClientCredentialsContext, ToastContext } from '../App';
import { ToastType } from '../components/toast.component';

export default function useCustomFetch() {

    const clientCredentials = useContext(ClientCredentialsContext);
    const toastsDispatch = useContext(ToastContext);

    const customFetch = async (urlSuffix: RequestInfo | URL, init?: RequestInit): Promise<any> => {
        try {
            if (!clientCredentials) {
                return null;
            }

            if (!clientCredentials.apiToken) {
                await authenticate();
            }

            if (init && init.headers) {
                init.headers = {...init?.headers, Authorization: 'Bearer ' + clientCredentials.apiToken};
            } else {
                init = {...init, headers: {'Authorization': '' + clientCredentials.apiToken,'Content-Type': 'application/json'}};
            }

            const url = clientCredentials.serverUrl + '/api/' + urlSuffix;
            return await fetch(url, init)
                .then(async res => {
                    if (res.status === 401) {
                        await authenticate();
                        return await fetch(url, init);
                    }
                    return res;
                }).then(async res => {
                    if (res.ok || (res.status >= 200 && res.status <= 300)) {
                        return await res.json();
                    } else {
                        throw new Error('custom fetch bad response on url: ' + url + 'with status code: ' + res.status);
                    }
                });

        } catch (e) {
            if (e instanceof Error) {
                toastsDispatch({
                    type: 'add',
                    toast: {message: e.message, type: ToastType.ERROR}
                });
            }
            return null;
        }
    };

    const authenticate = async (): Promise<boolean> => {
        if (clientCredentials?.username && clientCredentials?.password) {
            const url = clientCredentials.serverUrl + '/api/jwt/' + clientCredentials.username;
            return await fetch(url, {
                method: 'GET',
                headers: {'password': clientCredentials.password, 'Content-Type': 'application/json'},
            }).then(async res => {
                console.log('authentication in useFetch successful??', res.status);
                if (res.ok || res.status === 200) {
                    const token = await res.text();
                    console.log('authenticate token:', token);
                    clientCredentials.apiToken = token;
                    return true;
                } else {
                    throw new Error('Can\'t authenticate, error code: ' + res.status);
                }
            });
        } else {
            throw new Error('authenticate() no username or password');
        }
    };

    return customFetch;
}
