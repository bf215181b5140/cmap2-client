import { Route, Routes } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';
import './style/style.css';
import 'remixicon/fonts/remixicon.css';
import TitleBar from './components/titleBar/titleBar.component';
import Content from './components/content/content.componenet';
import AppMenu from './components/menu/appMenu/appMenu.component';
import Context from './components/context/context.component';
import LaunchPadPage from './pages/launchPad/launchPad.page';
import OscPage from './pages/osc/osc.page';
import TestingPage from './pages/testing/testing.page';
import NotificationsPage from './pages/notifications/notifications.page';
import AvatarsPage from './pages/avatars/avatars.page';
import ProfilePage from './pages/website/profile/profile.page';
import LayoutsPage from './pages/website/layouts/layouts.page';
import ParametersPage from './pages/website/state/parameters.page';
import TiersPage from './pages/website/tiers/tiers.page';
import UpdaterPage from './pages/updater/updater.page';
import WebsitePage from './pages/website/website.page';

export default function App() {

  return (<AppStyled>
    <Context>
      <TitleBar />
      <Content>
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
      </Content>
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
        margin: 8px;
        padding: 0;
    }

    h1 {
        text-shadow: 0 0 3px black;
    }

    h2 {
        font-size: 24px;
        color: ${props => props.theme.colors.font.h2};
        padding: 0;
        margin: 12px 0;
        text-shadow: 0 0 3px black;
    }

    h3 {
        font-size: 16px;
        color: ${props => props.theme.colors.font.h3};
        text-transform: uppercase;
        padding: 0;
        margin: 8px 0;
    }

    p {
        margin: 5px 0;
    }

    img {
        margin: 5px 0;
        border: 3px solid ${props => props.theme.colors.ui.element3};
        border-radius: 8px;
        display: inline-block;
    }

    ul, ol {
        margin: 5px 0;
        padding-inline-start: 25px;
    }

    a {
        text-decoration: none;
        font-weight: bold;
        color: ${props => props.theme.colors.font.textActive};
        
        i {
            font-weight: normal;
        }

        :hover {
            color: ${props => props.theme.colors.font.textBright};
        }
    }
    
    fieldset {
        margin: 8px 0;
        padding: 0 10px 8px 10px;
        border-width: 2px;
        border-style: solid;
        border-color: ${props => props.theme.colors.input.bg};
        border-radius: 8px;

        legend {
            padding: 0 10px;
        }
      
      :disabled {
        filter: saturate(0%);
      }
    }

`;
