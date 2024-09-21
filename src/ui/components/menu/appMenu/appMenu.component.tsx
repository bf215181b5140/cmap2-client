import styled from 'styled-components';
import AppMenuLink from './appMenuLink.component';
import { IS_DEV } from '../../../../shared/const';

export default function AppMenu() {

    // const { updateStatusColor } = useUpdateStatus();

    return (<AppMenuStyled>
        <AppMenuLink to="/" icon="ri-rocket-2-fill" tooltip={'Launch pad'} />
        <AppMenuLink to="/osc" icon="ri-gamepad-line" tooltip={'VRChat and OSC'} />
        <AppMenuLink to="/website" icon="ri-global-line" tooltip={'Website'} />
        <AppMenuLink to="/lovense" icon="ri-wireless-charging-fill" tooltip={'Lovense'} />
        <AppMenuLink to="/settings" icon="ri-settings-3-fill" tooltip={'Settings'} />
        {/* <NavBarLink to="/updater" icon="ri-download-2-fill" tooltip={'Updates'} attentionIcon={!!updateStatusColor} attentionColor={updateStatusColor} /> */}
        <AppMenuLink to="/notifications" icon="ri-discuss-line" tooltip={'Notifications'} />
        <AppMenuLink to="/guide" icon="ri-questionnaire-fill" tooltip={'Quick start'} />
        {IS_DEV && <AppMenuLink to="/testing" icon="ri-flask-line" tooltip={'Testing page'} />}
    </AppMenuStyled>);
}

const AppMenuStyled = styled.nav`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
`;
