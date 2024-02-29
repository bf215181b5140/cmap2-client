import styled from 'styled-components';
import { Route, Routes } from 'react-router-dom';
import ProfilePage from './profile/profile.page';
import AvatarsPage from './avatars/avatars.page';
import TiersPage from './tiers/tiers.page';
import React from 'react';
import WebsiteMenu from './components/websiteMenu.component';
import ConnectionPage from './connection/connection.page';

export default function WebsitePage() {

    return (<WebsitePageStyled>
        <WebsiteMenu />
        <div style={{flexBasis: '100%'}}>
        <Routes>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/avatars/:avatarId?/:layoutId?/:buttonId?" element={<AvatarsPage />} />
            <Route path="/tiers" element={<TiersPage />} />
            <Route path="*" element={<ConnectionPage />} />
        </Routes>
        </div>
    </WebsitePageStyled>);
}

const WebsitePageStyled = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  flex: 1;
`;
