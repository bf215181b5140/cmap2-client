import styled from 'styled-components';
import NavBarLink from './navBarLink.component';
import useUpdateStatus from '../../shared/hooks/updateStatus.hook';

export default function NavBar() {

    const { updateStatusColor } = useUpdateStatus();

    return (<NavBarStyled>
            <NavBarLink to="/" icon="ri-wifi-fill" />
            <NavBarLink to="/osc" icon="ri-gamepad-line" />
            <NavBarLink to="/website" icon="ri-global-line" />
            <NavBarLink to="/lovense" icon="ri-wireless-charging-fill" />
            <NavBarLink to="/settings" icon="ri-settings-3-fill" />
            <NavBarLink to="/updater" icon="ri-download-2-fill" attentionIcon={!!updateStatusColor} attentionColor={updateStatusColor} />
            <NavBarLink to="/guide" icon="ri-questionnaire-fill" />
    </NavBarStyled>);
}

const NavBarStyled = styled('nav')`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;
