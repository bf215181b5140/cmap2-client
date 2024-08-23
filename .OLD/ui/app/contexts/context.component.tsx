import { ReactProps } from 'cmap2-shared';
import useClientCredentials from '../shared/hooks/clientCredentials.hook';
import { ClientCredentialsContext } from './contexts';

export default function CmapContexts({ children }: ReactProps) {

    const clientCredentialsHook = useClientCredentials();

    return (<>
        <ClientCredentialsContext.Provider value={clientCredentialsHook}>
                {children}
        </ClientCredentialsContext.Provider>
    </>);
}
