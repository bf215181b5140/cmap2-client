import { createContext } from 'react';
import useCredentials from '../../hooks/credentials.hook';
import { Credentials } from '../../../shared/objects/credentials';

export const CredentialsContext = createContext<ReturnType<typeof useCredentials>>({
  credentials: new Credentials(),
  setCredentials() {
  },
  setLoginToken() {
  },
  clearLoginToken() {
  }
});
