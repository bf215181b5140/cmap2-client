import {Link} from "react-router-dom";
import styled from "styled-components";

export default function NavBar() {

    return (<NavBarStyled>
        <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
        </nav>
    </NavBarStyled>);
}

const NavBarStyled = styled.div`
  width: 800px;
  height: 50px;
  background-color: darkcyan;
  border-radius: 0 0 5px 5px;
`;