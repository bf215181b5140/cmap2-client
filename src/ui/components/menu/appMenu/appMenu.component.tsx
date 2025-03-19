import styled from 'styled-components';
import AppMenuLink from './appMenuLink.component';
import { IS_DEV } from '../../../../shared/const';
import { useContext } from 'react';
import { CredentialsContext } from '../../context/credentials.context';
import { FetchStatusContext } from '../../context/fetchStatus.context';

export default function AppMenu() {

  const { credentials: { isAdmin } } = useContext(CredentialsContext);
  const { fetchStatusRequests } = useContext(FetchStatusContext);
  const canInteract = !fetchStatusRequests || fetchStatusRequests.length === 0;

  return (<AppMenuStyled style={{pointerEvents: canInteract ? 'initial' : 'none'}}>
    <AppMenuLink to={'/'} icon={'ri-rocket-2-fill'} text={'Launch pad'} />
    <AppMenuLink to={'/osc'} icon={'ri-gamepad-line'} text={'OSC'} />
    <AppMenuLink to={'/avatars'} icon={'ri-contacts-book-fill'} text={'Avatars'} />
    <AppMenuLink to={'/website'} icon={'ri-global-line'} text={'Website'} />
    <AppMenuLink to={'/settings'} icon={'ri-settings-4-fill'} text={'Settings'} />
    {isAdmin && <AppMenuLink to={'/admin'} icon={'ri-admin-line'} text={'Admin'} />}
    {IS_DEV && <AppMenuLink to={'/testing'} icon={'ri-flask-line'} text={'Testing page'} />}
  </AppMenuStyled>);
}

const AppMenuStyled = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;
