import { Route, Routes } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';
import './style/style.css';
import 'remixicon/fonts/remixicon.css';
import TitleBar from './components/titleBar/titleBar.component';
import MainWindow from './components/mainWindow/mainWindow.componenet';
import NavBar from './components/navBar/navBar.component';
import Context from './components/context/context.component';

export default function App() {

    return (<AppStyled>
        <Context>
            <TitleBar />
            <MainWindow>
                <Routes>
                    {/* <Route path="/website/*" element={<WebsitePage />} /> */}
                    {/* <Route path="/avatars/:avatarId?" element={<AvatarsPage />} /> */}
                    {/* <Route path="/osc/*" element={<OscPage />} /> */}
                    {/* <Route path="/settings" element={<SettingsPage />} /> */}
                    {/* <Route path="/lovense" element={<LovensePage />} /> */}
                    {/* <Route path="/updater" element={<UpdaterPage />} /> */}
                    {/* <Route path="/guide" element={<GuidePage />} /> */}
                    {/* <Route path="/testing" element={<TestingPage />} /> */}
                    {/* <Route path="*" element={<LaunchPadPage />} /> */}
                </Routes>
            </MainWindow>
            <NavBar />
        </Context>
    </AppStyled>);
}

const AppStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
`;
