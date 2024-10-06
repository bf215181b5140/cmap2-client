import { z, ZodError } from 'zod';
import { useContext, useState } from 'react';
import { CredentialsContext } from '../components/context/credentials.context';
import { WEBSITE_URL } from '../../shared/const';
import log from 'electron-log/renderer';
import { FetchStatusContext } from '../components/context/fetchStatus.context';
import { nanoid } from 'nanoid';
import { useNotifications } from './useNotifications.hook';
import { ApiResponseSchema, NotificationType } from 'cmap2-shared';

interface ResponseWithData {
    response: Response;
    data: unknown;
}

type OnSuccess<T extends z.ZodTypeAny> = (data: T extends z.ZodType ? z.infer<T> : unknown, res: Response) => void

export class ApiError extends Error {
    name: string = 'ApiResponse';
    type: NotificationType;
    id: string;

    constructor(type: NotificationType, message: string, id: string) {
        super(message);
        this.type = type;
        this.id = id;
    }
}

export default function useCmapFetch() {

    const { credentials, clearLoginToken } = useContext(CredentialsContext);
    const { addNotification } = useNotifications();
    const { fetchStatusDispatch } = useContext(FetchStatusContext);
    const [fetchBusy, setFetchBusy] = useState<boolean>(false);
    const [fetchId] = useState<string>(nanoid(8));

    function GET<T extends z.ZodTypeAny>(urlSuffix: string, schema: T | undefined, onSuccess: OnSuccess<T>, onError?: () => void) {
        cmapFetch(urlSuffix, { method: 'GET' }, schema, onSuccess, onError);
    }

    function POST<T extends z.ZodTypeAny>(urlSuffix: string, data: any, schema: T | undefined, onSuccess: OnSuccess<T>, onError?: () => void) {
        const init = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        };

        cmapFetch(urlSuffix, init, schema, onSuccess, onError);
    }

    function PUT<T extends z.ZodTypeAny>(urlSuffix: string, data: any, schema: T | undefined, onSuccess: OnSuccess<T>, onError?: () => void) {
        const init = {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        };

        cmapFetch(urlSuffix, init, schema, onSuccess, onError);
    }

    function PATCH<T extends z.ZodTypeAny>(urlSuffix: string, data: any, schema: T | undefined, onSuccess: OnSuccess<T>, onError?: () => void) {
        const init = {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        };

        cmapFetch(urlSuffix, init, schema, onSuccess, onError);
    }

    function DELETE<T extends z.ZodTypeAny>(urlSuffix: string, data: any, schema: T | undefined, onSuccess: OnSuccess<T>, onError?: () => void) {
        const init = {
            method: 'DELETE',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        };

        cmapFetch(urlSuffix, init, schema, onSuccess, onError);
    }

    function cmapFetch<T extends z.ZodTypeAny>(urlSuffix: string, init: RequestInit, schema: T | undefined, onSuccess: OnSuccess<T>, onError?: () => void) {
        if (fetchBusy) return;
        setFetchBusy(true);
        fetchStatusDispatch({
            type: 'add',
            request: {
                type: init.method === 'GET' ? 'download' : 'upload',
                id: fetchId
            }
        });

        if (init.headers) {
            init.headers = { ...init.headers, Authorization: '' + credentials.apiToken };
        } else {
            init = { ...init, headers: { Authorization: '' + credentials.apiToken } };
        }

        const url = WEBSITE_URL + '/api/' + urlSuffix;

        fetch(url, init)
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
                if (cmapRes.response.ok) return cmapRes;

                // clear client token if we're unauthorized
                if (cmapRes.response.status === 401) clearLoginToken();

                // check if it's apiResponse object
                const apiResponse = ApiResponseSchema.safeParse(cmapRes.data);
                if (apiResponse.success) {
                    throw new ApiError(apiResponse.data.type, apiResponse.data.message, apiResponse.data.id);
                }

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
                let notificationType: NotificationType = 'error';
                let message = 'Unknown error connecting to server.';
                let id: string = nanoid(8);

                if (err instanceof ApiError) {
                    notificationType = err.type;
                    message = err.message;
                    id = err.id;
                } else if (err instanceof ZodError) {
                    message = 'Server returned unsupported data, please try updating the program';
                } else if (err instanceof Error || typeof err?.message === 'string') {
                    message = err.message;
                }

                log.error(message);

                addNotification(notificationType, message, { id: id, group: 'cmapFetch' });

                if (onError) onError();
            })
            // release fetch from inUse
            .finally(() => {
                setFetchBusy(false);
                fetchStatusDispatch({
                    type: 'remove',
                    request: {
                        type: 'upload',
                        id: fetchId
                    }
                });

            });
    }

    return { GET, POST, PUT, PATCH, DELETE, cmapFetch, fetchBusy, fetchId };
}
