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
import useSocketConnection from './hooks/socketConnection.hook';
import useClientCredentials from './hooks/clientCredentials.hook';
import ProfilePage from './pages/profile/profile.page';
import AvatarPage from './pages/avatar/avatar.page';
import { ClientCredentials } from '../shared/classes';
import SettingsPage from './pages/settings.page';

export const ClientCredentialsContext = React.createContext<ClientCredentials>(new ClientCredentials());

export default function App() {

    const {clientCredentials} = useClientCredentials();
    const socketConnection = useSocketConnection();

    return (<ClientCredentialsContext.Provider value={clientCredentials}>
        <AppStyled>
            <TitleBar socketConnection={socketConnection} />
            <MainWindow>
                <Routes>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/avatar/:avatarId?/:layoutId?/:buttonId?" element={<AvatarPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="*" element={<ConnectionPage socketConnection={socketConnection} />} />
                </Routes>
            </MainWindow>
            <NavBar />
        </AppStyled>
    </ClientCredentialsContext.Provider>);
}

const MainWindow = styled.div`
  overflow: auto;
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
