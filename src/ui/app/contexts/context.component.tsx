import { ReactProps } from 'cmap2-shared';
import useClientCredentials, { ClientCredentialsHook } from '../shared/hooks/clientCredentials.hook';
import React from 'react';
import { ClientCredentials } from '../../../shared/classes';
import useRendererSettings, { RendererSettingsContext } from '../shared/hooks/rendererSettings.hook';

export const ClientCredentialsContext = React.createContext<ClientCredentialsHook>({
    clientCredentials: new ClientCredentials(),
    setClientCredentials: () => {
    },
    setClientToken: () => {
    },
    clearClientToken: () => {
    }
});

export default function CmapContexts({ children }: ReactProps) {

    const clientCredentialsHook = useClientCredentials();
    const rendererSettingsHook = useRendererSettings();

    return (<>
        <ClientCredentialsContext.Provider value={clientCredentialsHook}>
            <RendererSettingsContext.Provider value={rendererSettingsHook}>
                {children}
            </RendererSettingsContext.Provider>
        </ClientCredentialsContext.Provider>
    </>);
}
