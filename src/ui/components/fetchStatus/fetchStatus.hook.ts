import { useReducer } from 'react';

export type FetchStatusRequestType = 'upload' | 'download';

export interface FetchStatusRequest {
    type: FetchStatusRequestType;
    id: string;
}

export type FetchStatusReducerAction =
    { type: 'add', request: FetchStatusRequest } |
    { type: 'remove', request: FetchStatusRequest } |
    { type: 'clear' };

function fetchStatusReducer(state: FetchStatusRequest[], action: FetchStatusReducerAction): FetchStatusRequest[] {
    switch (action.type) {
        case 'add':
            // filter first - solves dev double render fetch
            return [...state.filter((r => r.id !== action.request.id)), action.request];
        case 'remove':
            return state.filter(request => request.id !== action.request.id);
        case 'clear':
        default:
            return [];
    }
}

export function useFetchStatus() {
    const [fetchStatusRequests, fetchStatusDispatch] = useReducer(fetchStatusReducer, []);

    function fetchStatusIcon(requestType: FetchStatusRequestType): string {
        switch(requestType) {
            case 'upload':
                return 'ri-upload-cloud-line';
            case 'download':
            default:
                return 'ri-download-cloud-line';
        }
    }

    return { fetchStatusRequests, fetchStatusIcon, fetchStatusDispatch };
}
