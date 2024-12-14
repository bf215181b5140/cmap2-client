import styled from 'styled-components';
import AppMenuLink from './appMenuLink.component';
import { IS_DEV } from '../../../../shared/const';
import useUpdateStatus from '../../../hooks/updateStatus.hook';
import { useContext } from 'react';
import { CredentialsContext } from '../../context/credentials.context';

export default function AppMenu() {

  const { updateStatusColor } = useUpdateStatus();
  const { credentials: { isAdmin } } = useContext(CredentialsContext);


  return (<AppMenuStyled>
    <AppMenuLink to={'/'} icon={'ri-rocket-2-fill'} tooltip={'Launch pad'} />
    <AppMenuLink to={'/osc'} icon={'ri-gamepad-line'} tooltip={'OSC'} />
    <AppMenuLink to={'/avatars'} icon={'ri-contacts-book-fill'} tooltip={'Avatars'} />
    <AppMenuLink to={'/website'} icon={'ri-global-line'} tooltip={'Website'} />
    {isAdmin && <AppMenuLink to={'/admin'} icon={'ri-admin-line'} tooltip={'Admin'} />}
    {/* <AppMenuLink to={'/lovense'} icon={'ri-wireless-charging-fill'} tooltip={'Lovense'} /> */}
    <AppMenuLink to={'/notifications'} icon={'ri-discuss-line'} tooltip={'Notifications'} />
    <AppMenuLink to={'/updater'} icon={'ri-download-2-fill'} tooltip={'Updates'} attentionIcon={!!updateStatusColor} attentionColor={updateStatusColor} />
    <AppMenuLink to={'/guide'} icon={'ri-questionnaire-fill'} tooltip={'Help and guides'} />
    <AppMenuLink to={'/settings'} icon="ri-settings-3-fill" tooltip={'Settings'} />
    {IS_DEV && <AppMenuLink to={'/testing'} icon={'ri-flask-line'} tooltip={'Testing page'} />}
  </AppMenuStyled>);
}

const AppMenuStyled = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;
