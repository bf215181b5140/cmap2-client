import styled from 'styled-components';
import NavBarLink from './navBarLink.component';

export default function NavBar() {

    return (<NavBarStyled>
            <NavBarLink to="/" icon="ri-wifi-fill" />
            <NavBarLink to="/osc" icon="ri-gamepad-line" />
            <NavBarLink to="/website" icon="ri-global-line" />
            <NavBarLink to="/lovense" icon="ri-wireless-charging-fill" />
            <NavBarLink to="/settings" icon="ri-settings-3-fill" />
            {/* <NavBarLink to="/about" icon="ri-book-open-fill" /> */}
    </NavBarStyled>);
}

const NavBarStyled = styled('nav')`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;
