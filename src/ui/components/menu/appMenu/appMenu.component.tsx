import styled from 'styled-components';
import AppMenuLink from './appMenuLink.component';
import { IS_DEV } from '../../../../shared/const';
import useUpdateStatus from '../../../hooks/updateStatus.hook';
import { useContext } from 'react';
import { CredentialsContext } from '../../context/credentials.context';

export default function AppMenu() {

  // todo: notification for update
  const { updateStatusColor } = useUpdateStatus();
  const { credentials: { isAdmin } } = useContext(CredentialsContext);

  return (<AppMenuStyled>
    <AppMenuLink to={'/'} icon={'ri-rocket-2-fill'} text={'Launch pad'} />
    <AppMenuLink to={'/osc'} icon={'ri-gamepad-line'} text={'OSC'} />
    <AppMenuLink to={'/avatars'} icon={'ri-contacts-book-fill'} text={'Avatars'} />
    <AppMenuLink to={'/website'} icon={'ri-global-line'} text={'Website'} />
    {isAdmin && <AppMenuLink to={'/admin'} icon={'ri-admin-line'} text={'Admin'} />}
    <AppMenuLink to={'/notifications'} icon={'ri-discuss-line'} text={'Notifications'} />
    <AppMenuLink to={'/updater'} icon={'ri-download-2-fill'} text={'Updates'} />
    {IS_DEV && <AppMenuLink to={'/testing'} icon={'ri-flask-line'} text={'Testing page'} />}
  </AppMenuStyled>);
}

const AppMenuStyled = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;
