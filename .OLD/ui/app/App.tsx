import { Route, Routes } from 'react-router-dom';
import LaunchPadPage from './pages/launchPad/launchPad.page';
import React from 'react';
import styled from 'styled-components';
import TitleBar from './components/titleBar/titleBar.component';
import NavBar from './components/navBar/navBar.component';
import './App.css';
import 'remixicon/fonts/remixicon.css';
import SettingsPage from './pages/settings/settings.page';
import MainWindow from './components/mainWindow/mainWindow.componenet';
import LovensePage from './pages/lovense/lovense.page';
import WebsitePage from './pages/website/website.page';
import AvatarsPage from './pages/osc/avatars/avatars.page';
import OscPage from './pages/osc/osc.page';
import CmapContexts from './contexts/context.component';
import UpdaterPage from './pages/updater/updater.page';
import GuidePage from './pages/guide/guide.page';
import TestingPage from './pages/testing/testing.page';

export default function App() {

    return (<AppStyled>
        <CmapContexts>
            <TitleBar />
            <MainWindow>
                <Routes>
                    <Route path="/website/*" element={<WebsitePage />} />
                    <Route path="/avatars/:avatarId?" element={<AvatarsPage />} />
                    <Route path="/osc/*" element={<OscPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/lovense" element={<LovensePage />} />
                    <Route path="/updater" element={<UpdaterPage />} />
                    <Route path="/guide" element={<GuidePage />} />
                    <Route path="/testing" element={<TestingPage />} />
                    <Route path="*" element={<LaunchPadPage />} />
                </Routes>
            </MainWindow>
            <NavBar />
        </CmapContexts>
    </AppStyled>);
}

const AppStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;
