import { useState } from 'react';
import styled from 'styled-components';
import { SocketConnection, SocketConnectionType } from '../../../shared/SocketConnection';
import { ReactProps } from 'cmap2-shared';
import ConnectForm from './connect/connect.component';
import RegistrationForm from './register/register.component';

interface ConnectionPageProps extends ReactProps {
    socketConnection: SocketConnection;
}

export default function ConnectionPage({socketConnection}: ConnectionPageProps) {

    const [connectForm, setConnectForm] = useState<boolean>(true);

    return (<HomePageStyled>
        {connectForm ? <ConnectForm socketConnection={socketConnection} setConnectForm={setConnectForm} />
            : <RegistrationForm socketConnection={socketConnection} setConnectForm={setConnectForm} />}
    </HomePageStyled>);
}

const HomePageStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
