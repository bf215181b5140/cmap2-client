import { useEffect, useState } from 'react';
import { SocketConnection } from '../../../../../shared/SocketConnection';
import RegistrationForm from './register/register.component';
import ConnectForm from './connect/connect.component';
import styled from 'styled-components';

export default function ConnectionPage() {
    const [socketConnection, setSocketConnection] = useState<SocketConnection | null>(null);
    const [connectForm, setConnectForm] = useState<boolean>(true);

    useEffect(() => {
        window.electronAPI.get('getConnectionStatus').then(data => setSocketConnection(data));
        const removeListener = window.electronAPI.receive('updateConnectionStatus', (data) => setSocketConnection(data));

        return () => {
            if (removeListener) removeListener();
        }
    }, []);

    return (<HomePageStyled>
        {socketConnection !== null && (connectForm ? <ConnectForm socketConnection={socketConnection} setConnectForm={setConnectForm} />
            : <RegistrationForm socketConnection={socketConnection} setConnectForm={setConnectForm} />)}
    </HomePageStyled>);
}

const HomePageStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

