import { Route, Routes } from 'react-router-dom';
import ConnectionPage from '../pages/connection/connection.page';
import AboutPage from '../pages/about/about.page';
import React from 'react';
import styled from 'styled-components';
import TitleBar from './titleBar/titleBar.component';
import NavBar from './navBar/navBar.component';
import './App.css';
import 'remixicon/fonts/remixicon.css';
import colors from 'cmap2-shared/src/colors.json';
import useSocketConnection from '../shared/hooks/socketConnection.hook';
import useClientCredentials, { ClientCredentialsHook } from '../shared/hooks/clientCredentials.hook';
import ProfilePage from '../pages/profile/profile.page';
import AvatarPage from '../pages/avatar/avatar.page';
import { ClientCredentials } from '../../shared/classes';
import SettingsPage from '../pages/settings/settings.page';
import useToast from './toast/toast.hook';
import { ToastComponent } from './toast/toast.component';

export const ClientCredentialsContext = React.createContext<ClientCredentialsHook>({
    clientCredentials: new ClientCredentials(),
    setClientCredentials: () => {},
    setClientToken: (token: string) => {}
});
export const ToastContext = React.createContext<(action: any) => void>(() => {
});

export default function App() {

    const ClientCredentialsHook = useClientCredentials();
    const socketConnection = useSocketConnection();
    const {toasts, toastsDispatch} = useToast();

    return (
        <AppStyled>
            <ClientCredentialsContext.Provider value={ClientCredentialsHook}>
                <ToastContext.Provider value={toastsDispatch}>
                    <TitleBar socketConnection={socketConnection} />
                    <MainWindow>
                        {/* <button onClick={() => toastsDispatch({ */}
                        {/*     type: 'add', */}
                        {/*     toast: {message: 'e.message', type: ToastType.ERROR} */}
                        {/* })}>Toast</button> */}
                        <Routes>
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/avatar/:avatarId?/:layoutId?/:buttonId?" element={<AvatarPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="*" element={<ConnectionPage socketConnection={socketConnection} />} />
                        </Routes>
                    </MainWindow>
                    <ToastComponent toasts={toasts} dispatch={toastsDispatch} />
                    <NavBar />
                </ToastContext.Provider>
            </ClientCredentialsContext.Provider>
        </AppStyled>);
}

const MainWindow = styled.div`
  overflow: auto;
  width: 100%;
  background-color: ${colors['ui-background-1']};
  border: 2px solid ${colors['ui-background-3']};
  border-radius: 10px;
  box-sizing: border-box;
  flex: 1;
  position: relative;
`;

const AppStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;
