import styled from 'styled-components';
import NavBarLink from './navBarLink.component';

export default function NavBar() {

    return (<NavBarStyled>
            <NavBarLink to="/" icon="ri-wifi-fill" />
            <NavBarLink to="/profile" icon="ri-user-fill" />
            <NavBarLink to="/avatar" icon="ri-contacts-book-fill" />
            <NavBarLink to="/stats" icon="ri-pie-chart-2-fill" />
            <NavBarLink to="/settings" icon="ri-settings-3-fill" />
            <NavBarLink to="/about" icon="ri-book-open-fill" />
    </NavBarStyled>);
}

const NavBarStyled = styled('nav')`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;
