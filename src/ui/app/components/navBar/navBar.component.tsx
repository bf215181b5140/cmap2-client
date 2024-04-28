import styled from 'styled-components';
import NavBarLink from './navBarLink.component';
import useUpdateStatus from '../../shared/hooks/updateStatus.hook';

export default function NavBar() {

    const { updateStatusColor } = useUpdateStatus();

    return (<NavBarStyled>
            <NavBarLink to="/" icon="ri-rocket-2-fill" tooltip={'Launch pad'} />
            <NavBarLink to="/osc" icon="ri-gamepad-line" tooltip={'VRChat and OSC'} />
            <NavBarLink to="/website" icon="ri-global-line" tooltip={'Website'} />
            <NavBarLink to="/lovense" icon="ri-wireless-charging-fill" tooltip={'Lovense'} />
            <NavBarLink to="/settings" icon="ri-settings-3-fill" tooltip={'Settings'} />
            <NavBarLink to="/updater" icon="ri-download-2-fill" tooltip={'Updates'} attentionIcon={!!updateStatusColor} attentionColor={updateStatusColor} />
            <NavBarLink to="/guide" icon="ri-questionnaire-fill" tooltip={'Quick start'} />
    </NavBarStyled>);
}

const NavBarStyled = styled('nav')`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;
