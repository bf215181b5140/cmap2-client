import { useState } from 'react';
import Login from './login/login.component';
import styled from 'styled-components';
import { Content } from 'cmap2-shared/dist/react';
import WebsocketStatus from './websocketStatus/websocketStatus.component';
import Register from './register/register.component';

export default function ConnectionPage() {

    const [showLogin, setShowLogin] = useState<boolean>(true);

    return (<Content>
        {showLogin ? (
            <Login setShowLogin={setShowLogin} />
            ) : (
            <Register setShowLogin={setShowLogin} />
            )}
        <WebsocketStatus />
    </Content>);
}

const HomePageStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

