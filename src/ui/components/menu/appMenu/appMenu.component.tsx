import styled from 'styled-components';
import AppMenuLink from './appMenuLink.component';
import { IS_DEV } from '../../../../shared/const';

export default function AppMenu() {

  // const { updateStatusColor } = useUpdateStatus();

  return (<AppMenuStyled>
    <AppMenuLink to={'/'} icon={'ri-rocket-2-fill'} tooltip={'Launch pad'} />
    <AppMenuLink to={'/osc'} icon={'ri-gamepad-line'} tooltip={'OSC'} />
    <AppMenuLink to={'/avatars'} icon={'ri-contacts-book-fill'} tooltip={'Avatars'} />

    {/* disabled={!apiToken} */}
    <AppMenuLink to={'/profile'} icon={'ri-profile-fill'} tooltip={'Profile'} />
    <AppMenuLink to={'/layouts'} icon={'ri-layout-masonry-fill'} tooltip={'Layouts'} />
    <AppMenuLink to={'/parameters'} icon={'ri-archive-stack-fill'} tooltip={'Tracked parameters'} />
    <AppMenuLink to={'/tiers'} icon={'ri-medal-fill'} tooltip={'Tiers & invite keys'} />

    {/* <AppMenuLink to={'/website'} icon={'ri-global-line'} tooltip={'Website'} /> */}
    {/* <AppMenuLink to={'/lovense'} icon={'ri-wireless-charging-fill'} tooltip={'Lovense'} /> */}
    {/* <NavBarLink to="/updater" icon="ri-download-2-fill" tooltip={'Updates'} attentionIcon={!!updateStatusColor} attentionColor={updateStatusColor} /> */}
    <AppMenuLink to={'/notifications'} icon={'ri-discuss-line'} tooltip={'Notifications'} />
    <AppMenuLink to={'/guide'} icon={'ri-questionnaire-fill'} tooltip={'Quick start'} />
    <AppMenuLink to={'/settings'} icon="ri-settings-3-fill" tooltip={'Settings'} />
    {IS_DEV && <AppMenuLink to={'/testing'} icon={'ri-flask-line'} tooltip={'Testing page'} />}
  </AppMenuStyled>);
}

const AppMenuStyled = styled.nav`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
`;
