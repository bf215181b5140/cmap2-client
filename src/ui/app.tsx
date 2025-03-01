import { Route, Routes } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';
import './style/style.css';
import 'remixicon/fonts/remixicon.css';
import TitleBar from './components/titleBar/titleBar.component';
import AppMenu from './components/menu/appMenu/appMenu.component';
import Context from './components/context/context.component';
import LaunchPadPage from './pages/launchPad/launchPad.page';
import OscPage from './pages/osc/osc.page';
import TestingPage from './pages/testing/testing.page';
import NotificationsPage from './pages/notifications/notifications.page';
import AvatarsPage from './pages/avatars/avatars.page';
import UpdaterPage from './pages/updater/updater.page';
import WebsitePage from './pages/website/website.page';
import ModalComponent from './components/modal/modal.component';
import { ToastComponent } from './components/toast/toast.component';
import { FetchStatusComponent } from './components/fetchStatus/fetchStatus.component';

export default function App() {

  return (<AppStyled>
    <Context>
      <AppContent>
        <TitleBar />
        <Content>
          <ContentOverflow>
            <Routes>
              <Route path="/osc/*" element={<OscPage />} />
              <Route path="/avatars/:avatarId?" element={<AvatarsPage />} />
              <Route path="/website/*" element={<WebsitePage />} />
              {/* <Route path="/settings" element={<SettingsPage />} /> */}
              {/* <Route path="/lovense" element={<LovensePage />} /> */}
              <Route path="/updater" element={<UpdaterPage />} />
              {/* <Route path="/guide" element={<GuidePage />} /> */}
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/testing" element={<TestingPage />} />
              <Route path="*" element={<LaunchPadPage />} />
            </Routes>
          </ContentOverflow>
          <ModalComponent />
          <ToastComponent />
          <FetchStatusComponent />
        </Content>
      </AppContent>
      <AppMenu />
    </Context>
  </AppStyled>);
}

const AppStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;

  hr {
    border: 1px solid ${props => props.theme.colors.ui.appBgOpaque};
  }

  h2 {
    color: ${props => props.theme.colors.font.h2};
  }

  h3 {
    color: ${props => props.theme.colors.font.h3};
  }

  img {
    border: 3px solid ${props => props.theme.colors.ui.element3};
  }

  a {
    color: ${props => props.theme.colors.font.textActive};

    :hover {
      color: ${props => props.theme.colors.font.textBright};
    }
  }

  span.clickable {
    color: ${props => props.theme.colors.font.textBright};
    cursor: pointer;

    :hover {
      color: ${props => props.theme.colors.font.textActive};
    }
  }
`;

const AppContent = styled.div`
  overflow: hidden;
  width: 100%;
  background-color: ${props => props.theme.colors.ui.appBgOpaque};
  border: 2px solid ${props => props.theme.colors.ui.background5};
  border-radius: 10px;
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  overflow: hidden;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ContentOverflow = styled.div`
  overflow: auto;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
`;
