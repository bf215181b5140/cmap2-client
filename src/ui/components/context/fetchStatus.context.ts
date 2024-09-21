import { createContext } from 'react';
import { useFetchStatus } from '../fetchStatus/fetchStatus.hook';

export const FetchStatusContext = createContext<ReturnType<typeof useFetchStatus>>({
    fetchStatusRequests: [],
    fetchStatusIcon: () => '',
    fetchStatusDispatch: () => {}
});
