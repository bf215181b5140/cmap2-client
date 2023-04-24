import { useContext } from 'react';
import { ClientCredentialsContext, ToastContext } from '../../app/App';
import { ToastType } from '../../app/toast/toast.component';

interface CustomFetchResponse<T> {
    code: number;
    body: T | null;
}

export default function useCustomFetch() {

    const {clientCredentials, setClientToken} = useContext(ClientCredentialsContext);
    const toastsDispatch = useContext(ToastContext);

    async function customFetch<T>(urlSuffix: RequestInfo | URL, init?: RequestInit) {
        let token = clientCredentials.apiToken;
        try {
            if (!clientCredentials) {
                throw new Error('No client credentials');
            }

            if (!token) {
                token = await authenticate();
            }

            if (init && init.headers) {
                init.headers = {...init?.headers, Authorization: '' + token};
            } else {
                init = {...init, headers: {'Authorization': '' + token}};
            }

            const url = clientCredentials.serverUrl + '/api/' + urlSuffix;

            return await fetch(url, init)
                .then(async res => {
                    if (res.status === 401) {
                        token = await authenticate();
                        init = {...init, headers: {'Authorization': '' + token}};
                        return await fetch(url, init);
                    }
                    return res;
                }).then(async res => {
                    if (res.ok) {
                        const result: CustomFetchResponse<T> = {code: res.status, body: null};
                        if (res.headers.get('Content-Length') === '0') {
                            return result;
                        }
                        if (res.headers.get('Content-Type')?.startsWith('application/json')) {
                            result.body = await res.json() as T;
                            return result;
                        }
                        if (res.headers.get('Content-Type')?.startsWith('text/html')) {
                            result.body = await res.text() as T;
                            return result;
                        }

                        throw new Error('custom fetch not a application/json or text/html response');
                        // await res.text();
                        // return result;
                    } else {
                        throw new Error('custom fetch bad response on url: ' + url + ' with status code: ' + res.status);
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
    }

    const authenticate = async (): Promise<string> => {
        if (clientCredentials?.username && clientCredentials?.password) {
            const url = clientCredentials.serverUrl + '/api/jwt/' + clientCredentials.username;
            return await fetch(url, {
                method: 'GET',
                headers: {'password': clientCredentials.password, 'Content-Type': 'application/json'},
            }).then(async res => {
                if (res.ok || res.status === 200) {
                    const token = await res.text()
                    setClientToken(token);
                    return token;
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
