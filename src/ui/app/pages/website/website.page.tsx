import styled from 'styled-components';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProfilePage from './profile/profile.page';
import AvatarsPage from './avatars/avatars.page';
import TiersPage from './tiers/tiers.page';
import React, { useContext, useEffect, useState } from 'react';
import ConnectionPage from './connection/connection.page';
import Submenu from '../../shared/components/submenu/submenu.component';
import SubmenuLink from '../../shared/components/submenu/submenuLink.component';
import { ClientCredentialsContext } from '../../App';
import { WebsitePageDTO } from 'cmap2-shared';
import useCmapFetch from '../../shared/hooks/cmapFetch.hook';
import ApproveFilePage from './admin/approveFile/approveFile.page';
import ClientVersionsPage from './admin/clientVersions/clientVersions.page';

export default function WebsitePage() {

    const { clientCredentials: { apiToken } } = useContext(ClientCredentialsContext);
    const cmapFetch = useCmapFetch();
    const [pageData, setPageData] = useState<WebsitePageDTO | null>(null);

    useEffect(() => {
        if (apiToken) cmapFetch<WebsitePageDTO>('websitePage', {}, data => setPageData(data));
    }, []);

    useEffect(() => {
        setPageData(null);
        if (apiToken) cmapFetch<WebsitePageDTO>('websitePage', {}, data => setPageData(data));
    }, [apiToken]);

    return (<WebsitePageStyled>
        <Submenu>
            <SubmenuLink to={'/website/connection'} icon={'ri-wifi-fill'} tooltip={'Connection status'} />
            <SubmenuLink to={'/website/profile'} icon={'ri-user-fill'} tooltip={'Website profile'} disabled={!apiToken} />
            <SubmenuLink to={'/website/avatars'} icon={'ri-contacts-book-fill'} tooltip={'Website layout'} disabled={!apiToken} />
            <SubmenuLink to={'/website/tiers'} icon={'ri-medal-fill'} tooltip={'Account tiers'} disabled={!apiToken} />

            {pageData?.isAdmin && (<>
                <hr />
                <SubmenuLink to={'/website/approveFiles'} icon={'ri-gallery-fill'} tooltip={'Approve file uploads'} />
                <SubmenuLink to={'/website/clientVersions'} icon={'ri-git-branch-line'} tooltip={'Client versions'} />
            </>)}
        </Submenu>

        <div style={{ flexBasis: '100%' }}>
            <Routes>
                <Route path="/connection" element={<ConnectionPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/avatars/:avatarId?/:layoutId?/:buttonId?" element={<AvatarsPage />} />
                <Route path="/tiers" element={<TiersPage />} />

                {/* Admin pages */}
                <Route path="/approveFiles" element={<ApproveFilePage />} />
                <Route path="/clientVersions" element={<ClientVersionsPage />} />

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
