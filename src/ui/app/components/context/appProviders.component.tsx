import { ReactProps } from 'cmap2-shared';
import { ClientCredentialsContext } from './appContexts';
import useClientCredentials from '../../shared/hooks/clientCredentials.hook';

export default function AppProviders({children}: ReactProps) {

    const clientCredentialsHook = useClientCredentials();

    return (<>
        <ClientCredentialsContext.Provider value={clientCredentialsHook}>
                {children}
        </ClientCredentialsContext.Provider>
    </>)
}
