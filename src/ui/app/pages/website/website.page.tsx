import styled from 'styled-components';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProfilePage from './profile/profile.page';
import AvatarsPage from './avatars/avatars.page';
import TiersPage from './tiers/tiers.page';
import React from 'react';
import ConnectionPage from './connection/connection.page';
import Submenu from '../../shared/components/submenu/submenu.component';
import SubmenuLink from '../../shared/components/submenu/submenuLink.component';

export default function WebsitePage() {

    return (<WebsitePageStyled>
        <Submenu>
            <SubmenuLink to={'/website/connection'} icon={'ri-wifi-fill'} />
            <SubmenuLink to={'/website/profile'} icon={'ri-user-fill'} />
            <SubmenuLink to={'/website/avatars'} icon={'ri-contacts-book-fill'} />
            <SubmenuLink to={'/website/tiers'} icon={'ri-medal-fill'} />
        </Submenu>

        <div style={{flexBasis: '100%'}}>
            <Routes>
                <Route path="/connection" element={<ConnectionPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/avatars/:avatarId?/:layoutId?/:buttonId?" element={<AvatarsPage />} />
                <Route path="/tiers" element={<TiersPage />} />
                <Route path="*" element={<Navigate to={'/website/connection'} />} />
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
