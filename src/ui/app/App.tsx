import { Route, Routes } from 'react-router-dom';
import ConnectionPage from '../pages/connection/connection.page';
import React from 'react';
import styled from 'styled-components';
import TitleBar from './titleBar/titleBar.component';
import NavBar from './navBar/navBar.component';
import './App.css';
import 'remixicon/fonts/remixicon.css';
import useSocketConnection from '../shared/hooks/socketConnection.hook';
import useClientCredentials, { ClientCredentialsHook } from '../shared/hooks/clientCredentials.hook';
import ProfilePage from '../pages/profile/profile.page';
import AvatarsPage from '../pages/avatars/avatars.page';
import { ClientCredentials } from '../../shared/classes';
import SettingsPage from '../pages/settings/settings.page';
import TiersPage from '../pages/tiers/tiers.page';
import MainWindow from './mainWindow/mainWindow.componenet';
import LovensePage from '../pages/lovense/lovense.page';

export const ClientCredentialsContext = React.createContext<ClientCredentialsHook>({
    clientCredentials: new ClientCredentials(),
    setClientCredentials: () => {
    },
    setClientToken: (token: string) => {
    }
});

export default function App() {

    const ClientCredentialsHook = useClientCredentials();
    const socketConnection = useSocketConnection();

    return (
        <AppStyled>
            <ClientCredentialsContext.Provider value={ClientCredentialsHook}>
                    <TitleBar socketConnection={socketConnection} />
                    <MainWindow>
                            <Routes>
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/avatars/:avatarId?/:layoutId?/:buttonId?" element={<AvatarsPage />} />
                                <Route path="/tiers" element={<TiersPage />} />
                                <Route path="/settings" element={<SettingsPage />} />
                                <Route path="/lovense" element={<LovensePage />} />
                                <Route path="*" element={<ConnectionPage socketConnection={socketConnection} />} />
                            </Routes>
                    </MainWindow>
                    <NavBar />
            </ClientCredentialsContext.Provider>
        </AppStyled>);
}

const AppStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;
