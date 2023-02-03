import { Route, Routes } from 'react-router-dom';
import ConnectionPage from './pages/connection.page';
import AboutPage from './pages/about.page';
import React from 'react';
import styled from 'styled-components';
import TitleBar from './components/titleBar.component';
import NavBar from './components/navBar.component';
import './style/App.css';
import 'remixicon/fonts/remixicon.css';
import colors from './style/colors.json';
import useConnectionStatus from './hooks/connectionStatus.hook';
import { ClientCredentials, SocketConnectionStatus } from '../shared/global';
import { SocketConnectionState } from '../shared/enums';
import { ClientData } from '../shared/clientData';
import useClientData from './hooks/clientData.hook';
import useClientCredentials from './hooks/clientCredentials.hook';
import ProfilePage from './pages/profile.page';

export const ClientCredentialsContext = React.createContext<ClientCredentials>({
    apiKey: '',
    username: '',
    serverUrl: ''
});

export const ConnectionStatusContext = React.createContext<SocketConnectionStatus>({
    state: SocketConnectionState.DISCONNECTED,
    message: 'Not connected',
    description: ''
});

export const ClientDataContext = React.createContext<ClientData | null>(null);

export default function App() {

    const clientCredentials = useClientCredentials();
    const connectionStatus = useConnectionStatus();
    const clientData = useClientData(connectionStatus, clientCredentials);

    return (<AppStyled>
        <ConnectionStatusContext.Provider value={connectionStatus}>
        <ClientDataContext.Provider value={clientData}>
        <ClientCredentialsContext.Provider value={clientCredentials}>
            <TitleBar />
            <MainWindow>
                    <Routes>
                        <Route path="/" element={<ConnectionPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="*" element={<ConnectionPage />} />
                    </Routes>
            </MainWindow>
            <NavBar />
        </ClientCredentialsContext.Provider>
        </ClientDataContext.Provider>
        </ConnectionStatusContext.Provider>
    </AppStyled>);
}

const MainWindow = styled.div`
  width: 100%;
  background-color: ${colors['ui-background-1']};
  border: 2px solid ${colors['ui-background-3']};
  border-radius: 10px;
  box-sizing: border-box;
  flex: 1;
`;

const AppStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;
