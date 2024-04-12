import { useContext, useState } from 'react';
import { ToastContext } from '../../components/mainWindow/mainWindow.componenet';
import { WEBSITE_URL } from '../../../../shared/const';
import { ToastType } from '../../components/toast/toast.hook';
import { ClientCredentialsContext } from '../../components/context/appContexts';

interface CmapFetchResponse {
    ok: boolean;
    code: number;
    body: any;
}

export default function useCmapFetch() {

    const {clientCredentials, clearClientToken} = useContext(ClientCredentialsContext);
    const toastsDispatch = useContext(ToastContext);
    const [inUse, setInUse] = useState<boolean>(false);

    async function cmapFetch<T>(urlSuffix: RequestInfo | URL, init: RequestInit, onSuccess: (data: T, res: CmapFetchResponse) => void, onError?: () => void): Promise<void> {
        if (inUse) return;
        setInUse(true);

        if (init.headers) {
            init.headers = {...init?.headers, Authorization: '' + clientCredentials.apiToken};
        } else {
            init = {...init, headers: {Authorization: '' + clientCredentials.apiToken}};
        }

        const url = WEBSITE_URL + '/api/' + urlSuffix;

        return await fetch(url, init)
            // Process server response data
            .then(async res => {
                const result: CmapFetchResponse = {ok: res.ok, code: res.status, body: null};

                const contentLength = res.headers.get('Content-Length');
                const contentType = res.headers.get('Content-Type');

                if (contentLength === '0') {
                    return result;
                }

                if (contentType?.startsWith('application/json')) {
                    result.body = await res.json();
                    return result;
                }

                if (contentType?.startsWith('text/html') || contentType?.startsWith('text/plain')) {
                    result.body = await res.text();
                    return result;
                }

                if (contentType?.startsWith('image/')) {
                    result.body = await res.blob();
                    return result;
                }

                throw new Error(`Server response is not in supported format: ${contentType}`);
            })
            // Check response status and run callback or throw error
            .then(cmapRes => {
                if (cmapRes.ok) {
                    // Todo validate response? :/
                    onSuccess(cmapRes.body as T, cmapRes);
                } else {
                    if (cmapRes.code === 401) {
                        clearClientToken();
                    }

                    if (typeof cmapRes.body === 'string') {
                        throw new Error(cmapRes.body);
                    } else if (cmapRes.body?.name === 'CmapApiError') {
                        throw new Error(cmapRes.body.message);
                    } else {
                        throw new Error(`Unknown server error, status code ${cmapRes.code} on url: ${url}`);
                    }
                }
            })
            // Catch errors and display toast with error message, run error callback if provided
            .catch(e => {
                if (e instanceof Error) {
                    toastsDispatch({
                        type: 'add',
                        toast: {message: e.message, type: ToastType.ERROR, group: 'cmapFetchError'}
                    });
                } else {
                    toastsDispatch({
                        type: 'add',
                        toast: {message: 'Unknown fetch error', type: ToastType.ERROR, group: 'cmapFetchError'}
                    });
                }
                if (onError) onError();
            }).finally(() => setInUse(false));
    }

    return cmapFetch;
}
