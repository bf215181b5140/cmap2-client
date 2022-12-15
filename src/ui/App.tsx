import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/home.component';
import AboutPage from './pages/about.component';
import React from 'react';
import styled from 'styled-components';
import TitleBar from './components/titleBar.component';
import NavBar from './components/navBar.component';
import './style/App.css';
import 'remixicon/fonts/remixicon.css';
import colors from './style/colors.json';
import useConnectionStatus from './hooks/connectionStatus.hook';
import { SocketConnectionStatus } from '../global';
import { SocketConnectionState } from '../enums';

export const ConnectionStatusContext = React.createContext<SocketConnectionStatus>({
    state: SocketConnectionState.DISCONNECTED,
    message: 'Not connected',
    description: ''
});

export default function App() {

    const connectionStatus = useConnectionStatus();

    return (<AppStyled>
        <ConnectionStatusContext.Provider value={connectionStatus}>
            <TitleBar />
            <MainWindow>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="*" element={<HomePage />} />
                    </Routes>
            </MainWindow>
            <NavBar />
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
