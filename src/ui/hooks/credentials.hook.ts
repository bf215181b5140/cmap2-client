import { LoginTokenDTO } from 'cmap2-shared';
import { useEffect, useState } from 'react';
import { Credentials } from '../../shared/objects/credentials';

export default function useCredentials() {

  const [credentials, setCredentialsInternal] = useState<Credentials>(window.IPC.store.getSync('credentials'));

  function setCredentials(credentials: Credentials) {
    const newCredentials = { ...credentials };
    setCredentialsInternal(newCredentials);
    window.IPC.store.set('credentials', newCredentials);
  }

  function setLoginToken(token: LoginTokenDTO) {
    const newCredentials: Credentials = { ...credentials, apiToken: token.apiToken, displayName: token.displayName, isAdmin: token.isAdmin };
    setCredentials(newCredentials);
    window.IPC.store.set('credentials', newCredentials);
  }

  function clearLoginToken() {
    const newCredentials: Credentials = { ...credentials, apiToken: null, displayName: null, isAdmin: null };
    setCredentials(newCredentials);
    window.IPC.store.set('credentials', newCredentials);
  }

  return { credentials, setCredentials, setLoginToken, clearLoginToken };
}
