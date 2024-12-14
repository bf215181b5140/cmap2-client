import Segment from '../../../components/segment/segment.component';
import SegmentMenu from '../../../components/menu/segmentMenu/segmentMenu.component';
import SegmentMenuLink from '../../../components/menu/segmentMenu/segmentMenuLink.component';
import Login from './login/login.component';
import Register from './register/register.component';
import { useContext, useState } from 'react';
import { CredentialsContext } from '../../../components/context/credentials.context';
import Account from './account/account.component';
import { Page } from '../../../components/page/page.component';

export default function ConnectionPage() {

  const { credentials: { apiToken } } = useContext(CredentialsContext);
  const [segment, setSegment] = useState<'welcome' | 'login' | 'register'>('login');

  if (apiToken && segment !== 'welcome') setSegment('welcome');
  if (!apiToken && segment === 'welcome') setSegment('login');

  return (<Page>
    <Segment width={'Half'}>

    <SegmentMenu>
      <SegmentMenuLink onClick={() => setSegment('welcome')} active={segment === 'welcome'} icon={'ri-user-line'} disabled={!apiToken}>Account</SegmentMenuLink>
      <SegmentMenuLink onClick={() => setSegment('login')} active={segment === 'login'} icon={'ri-user-follow-line'} disabled={!!apiToken}>Login</SegmentMenuLink>
      <SegmentMenuLink onClick={() => setSegment('register')} active={segment === 'register'} icon={'ri-user-add-line'} disabled={!!apiToken}>Register</SegmentMenuLink>
    </SegmentMenu>

    {segment === 'welcome' && <Account />}
    {segment === 'login' && <Login />}
    {segment === 'register' && <Register loginSegment={() => setSegment('login')} />}

  </Segment>
  </Page>);
}