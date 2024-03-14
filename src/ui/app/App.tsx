import { Route, Routes } from 'react-router-dom';
import LaunchPadPage from './pages/launchPad/launchPad.page';
import React from 'react';
import styled from 'styled-components';
import TitleBar from './components/titleBar/titleBar.component';
import NavBar from './components/navBar/navBar.component';
import './App.css';
import 'remixicon/fonts/remixicon.css';
import useSocketConnection from './shared/hooks/socketConnection.hook';
import useClientCredentials, { ClientCredentialsHook } from './shared/hooks/clientCredentials.hook';
import { ClientCredentials } from '../../shared/classes';
import SettingsPage from './pages/settings/settings.page';
import MainWindow from './components/mainWindow/mainWindow.componenet';
import LovensePage from './pages/lovense/lovense.page';
import WebsitePage from './pages/website/website.page';
import AvatarsPage from './pages/osc/avatars/avatars.page';
import VrcStatusPage from './pages/osc/vrcStatus/vrcStatus.page';
import OscPage from './pages/osc/osc.page';

export const ClientCredentialsContext = React.createContext<ClientCredentialsHook>({
    clientCredentials: new ClientCredentials(),
    setClientCredentials: () => {
    },
    setClientToken: (token: string) => {
    }
});

export default function App() {

    const clientCredentialsHook = useClientCredentials();
    const socketConnection = useSocketConnection();

    return (
        <AppStyled>
            <ClientCredentialsContext.Provider value={clientCredentialsHook}>
                <TitleBar socketConnection={socketConnection} />
                <MainWindow>
                    <Routes>
                        <Route path="/website/*" element={<WebsitePage />} />
                        <Route path="/avatars/:avatarId?" element={<AvatarsPage />} />
                        <Route path="/osc/*" element={<OscPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/lovense" element={<LovensePage />} />
                        <Route path="*" element={<LaunchPadPage />} />
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
