import Login from './login/login.component';
import Register from './register/register.component';
import React, { useContext, useState } from 'react';
import { CredentialsContext } from '../../../components/context/credentials.context';
import Status from './status/status.component';
import { Page } from '../../../components/page/page.component';
import PageMenu from '../../../components/menu/pageMenu/pageMenu.component';

export default function ConnectionPage() {

  const { credentials: { apiToken } } = useContext(CredentialsContext);
  const [section, setSection] = useState<'connection' | 'login' | 'register'>('login');

  if (apiToken && section !== 'connection') setSection('connection');
  if (!apiToken && section === 'connection') setSection('login');

  return (<Page flexDirection={'column'}>

    <PageMenu>
      <div onClick={() => setSection('connection')} aria-current={section === 'connection'} aria-disabled={!apiToken}>Connection</div>
      <div onClick={() => setSection('login')} aria-current={section === 'login'} aria-disabled={!!apiToken}>Login</div>
      <div onClick={() => setSection('register')} aria-current={section === 'register'} aria-disabled={!!apiToken}>Register</div>
    </PageMenu>

    {section === 'connection' && <Status />}
    {section === 'login' && <Login />}
    {section === 'register' && <Register toLogin={() => setSection('login')} />}

  </Page>);
}