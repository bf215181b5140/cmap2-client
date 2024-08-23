import { createContext } from 'react';
import { ClientCredentialsHook } from '../shared/hooks/clientCredentials.hook';
import { ClientCredentials } from '../../../shared/classes';

export const ClientCredentialsContext = createContext<ClientCredentialsHook>({
    clientCredentials: new ClientCredentials(),
    setClientCredentials: () => {
    },
    setClientToken: () => {
    },
    clearClientToken: () => {
    }
});
