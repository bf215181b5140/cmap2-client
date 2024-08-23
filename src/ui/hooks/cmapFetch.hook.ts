import { z, ZodError } from 'zod';
import { useContext, useState } from 'react';
import { ClientCredentialsContext } from './src/ui/app/contexts/contexts';
import { ToastContext } from './src/ui/app/components/mainWindow/mainWindow.componenet';
import { WEBSITE_URL } from './src/shared/const';
import { ToastType } from './src/ui/app/components/toast/toast.hook';
import log from 'electron-log/renderer';

interface ResponseWithData {
    response: Response;
    data: unknown;
}

type OnSuccess<T extends z.ZodTypeAny> = (data: T extends z.ZodObject<any> ? z.infer<T> : unknown, res: Response) => void

export default function useCmapFetch() {

    const { clientCredentials, clearClientToken } = useContext(ClientCredentialsContext);
    const toastsDispatch = useContext(ToastContext);
    const [inUse, setInUse] = useState<boolean>(false);

    function GET<T extends z.ZodTypeAny>(urlSuffix: string, schema: T | undefined, onSuccess: OnSuccess<T>, onError?: () => void) {
        cmapFetch(urlSuffix, {}, schema, onSuccess, onError);
    }

    async function POST<T extends z.ZodTypeAny>(urlSuffix: string, data: any, schema: T | undefined, onSuccess: OnSuccess<T>,
        onError?: () => void): Promise<void> {
        const init = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        };

        cmapFetch(urlSuffix, init, schema, onSuccess, onError);
    }

    async function PUT<T extends z.ZodTypeAny>(urlSuffix: string, data: any, schema: T | undefined, onSuccess: OnSuccess<T>,
        onError?: () => void): Promise<void> {
        const init = {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        };

        cmapFetch(urlSuffix, init, schema, onSuccess, onError);
    }

    async function PATCH<T extends z.ZodTypeAny>(urlSuffix: string, data: any, schema: T | undefined, onSuccess: OnSuccess<T>,
        onError?: () => void): Promise<void> {
        const init = {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        };

        cmapFetch(urlSuffix, init, schema, onSuccess, onError);
    }

    async function DELETE<T extends z.ZodTypeAny>(urlSuffix: string, data: any, schema: T | undefined, onSuccess: OnSuccess<T>,
        onError?: () => void): Promise<void> {
        const init = {
            method: 'DELETE',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        };

        cmapFetch(urlSuffix, init, schema, onSuccess, onError);
    }

    async function cmapFetch<T extends z.ZodTypeAny>(urlSuffix: string, init: RequestInit, schema: T | undefined, onSuccess: OnSuccess<T>,
        onError?: () => void): Promise<void> {
        if (inUse) return;
        setInUse(true);

        if (init.headers) {
            init.headers = { ...init.headers, Authorization: '' + clientCredentials.apiToken };
        } else {
            init = { ...init, headers: { Authorization: '' + clientCredentials.apiToken } };
        }

        const url = WEBSITE_URL + '/api/' + urlSuffix;

        return await fetch(url, init)
            // Process server response data
            .then(async res => {
                const result: ResponseWithData = { response: res, data: null };

                const contentLength = res.headers.get('Content-Length');
                const contentType = res.headers.get('Content-Type');

                if (contentLength === '0') {
                    return result;
                }

                if (contentType?.startsWith('application/json')) {
                    result.data = await res.json();
                    return result;
                }

                if (contentType?.startsWith('text/html') || contentType?.startsWith('text/plain')) {
                    result.data = await res.text();
                    return result;
                }

                if (contentType?.startsWith('image/')) {
                    result.data = await res.blob();
                    return result;
                }

                throw new Error(`Server response is not in supported format: ${contentType}`);
            })
            // Check response status and throw error on not ok
            .then(cmapRes => {
                if (cmapRes.response.ok === true) return cmapRes;

                // clear client token if we're unauthorized
                if (cmapRes.response.status === 401) clearClientToken();

                // check for string error message and throw error
                if (typeof cmapRes.data === 'string') {
                    throw new Error(cmapRes.data);
                } else {
                    throw new Error(`${cmapRes.response.status} server error on url: ${url}`);
                }
            })
            // validate response body if we set schema and trigger onSuccess
            .then(cmapRes => {
                if (schema) {
                    onSuccess(schema.parse(cmapRes.data), cmapRes.response);
                } else {
                    onSuccess(cmapRes.data as any, cmapRes.response);
                }
            })
            // Catch errors and display toast with error message, run error callback if provided
            .catch(err => {
                let message = 'Unknown cmapFetch error';

                if (err instanceof ZodError) {
                    message = 'Server returned unsupported data, please try updating the program';
                } else if (err instanceof Error || typeof err?.message === 'string') {
                    message = err.message;
                }

                log.error(err.message);

                toastsDispatch({
                    type: 'add',
                    toast: {
                        message: message,
                        type: ToastType.ERROR,
                        group: 'cmapFetchError'
                    }
                });

                if (onError) onError();
            })
            // release fetch from inUse
            .finally(() => setInUse(false));
    }

    return { GET, POST, PUT, PATCH, DELETE };
}
