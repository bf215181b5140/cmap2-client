import { useState } from 'react';
import Login from './login/login.component';
import { Content } from 'cmap2-shared/dist/react';
import WebsocketStatus from './websocketStatus/websocketStatus.component';
import Register from './register/register.component';

export default function ConnectionPage() {

    const [showLogin, setShowLogin] = useState<boolean>(true);

    return (<Content flexDirection={'row'}>
        <WebsocketStatus />
        {showLogin ? (
            <Login setShowLogin={setShowLogin} />
            ) : (
            <Register setShowLogin={setShowLogin} />
            )}
    </Content>);
}

