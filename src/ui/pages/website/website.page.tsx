import styled from 'styled-components';
import { Navigate, Route, Routes } from 'react-router-dom';
import React, { useContext } from 'react';
import ContentMenu from '../../components/menu/contentMenu/contentMenu.component';
import ContentMenuLink from '../../components/menu/contentMenu/contentMenuLink.component';
import { CredentialsContext } from '../../components/context/credentials.context';
import ConnectionPage from './connection/connection.page';
import ProfilePage from './profile/profile.page';
import TiersPage from './tiers/tiers.page';

export default function WebsitePage() {

    const { credentials: { apiToken, isAdmin } } = useContext(CredentialsContext);

    return (<>
        <ContentMenu>
            <ContentMenuLink to={'/website/connection'} icon={'ri-wifi-fill'} tooltip={'Website connection'} />
            <ContentMenuLink to={'/website/profile'} icon={'ri-profile-fill'} tooltip={'Website profile'} disabled={!apiToken} />
            <ContentMenuLink to={'/website/avatars'} icon={'ri-layout-masonry-fill'} tooltip={'Website layout'} disabled={!apiToken} />
            <ContentMenuLink to={'/website/state'} icon={'ri-archive-stack-fill'} tooltip={'Website state'} disabled={!apiToken} />
            <ContentMenuLink to={'/website/tiers'} icon={'ri-medal-fill'} tooltip={'Account tiers'} disabled={!apiToken} />

            {isAdmin && (<>
                <hr />
                <ContentMenuLink to={'/website/approveFiles'} icon={'ri-gallery-fill'} tooltip={'Approve file uploads'} />
                <ContentMenuLink to={'/website/clientVersions'} icon={'ri-git-branch-line'} tooltip={'Client versions'} />
            </>)}
        </ContentMenu>

        <Routes>
            <Route path="/connection" element={<ConnectionPage />} />
            <Route path="/profile/:page?" element={<ProfilePage />} />
            {/* <Route path="/avatars/:avatarId?/:layoutId?/:buttonId?" element={<AvatarsPage />} /> */}
            {/* <Route path="/state" element={<StatePage />} /> */}
            <Route path="/tiers" element={<TiersPage />} />

            {/* /!* Admin pages *!/ */}
            {/* <Route path="/approveFiles" element={<ApproveFilesPage />} /> */}
            {/* <Route path="/clientVersions" element={<UpdatesPage />} /> */}

            <Route path="*" element={<Navigate to={'/website/connection'} />} />
        </Routes>
    </>);
}
