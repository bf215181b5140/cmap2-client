import { Navigate, Route, Routes } from 'react-router-dom';
import React, { useContext } from 'react';
import ContentMenu from '../../components/menu/contentMenu/contentMenu.component';
import ContentMenuLink from '../../components/menu/contentMenu/contentMenuLink.component';
import { CredentialsContext } from '../../components/context/credentials.context';
import ConnectionPage from './connection/connection.page';
import ProfilePage from './profile/profile.page';
import TiersPage from './tiers/tiers.page';
import ParametersPage from './parameters/parameters.page';
import LayoutsPage from './layouts/layouts.page';

export default function WebsitePage() {

    const { credentials: { apiToken, isAdmin } } = useContext(CredentialsContext);

    return (<>
        <ContentMenu>
            <ContentMenuLink to={'/website/connection'} icon={'ri-wifi-fill'} tooltip={'Connection'} />
            <ContentMenuLink to={'/website/profile'} icon={'ri-profile-fill'} tooltip={'Profile'} disabled={!apiToken} />
            <ContentMenuLink to={'/website/layouts'} icon={'ri-layout-masonry-fill'} tooltip={'Layouts'} disabled={!apiToken} />
            <ContentMenuLink to={'/website/parameters'} icon={'ri-archive-stack-fill'} tooltip={'Tracked parameters'} disabled={!apiToken} />
            <ContentMenuLink to={'/website/tiers'} icon={'ri-medal-fill'} tooltip={'Tiers & invite keys'} disabled={!apiToken} />

            {isAdmin && (<>
                <hr />
                <ContentMenuLink to={'/website/approveFiles'} icon={'ri-gallery-fill'} tooltip={'Approve file uploads'} />
                <ContentMenuLink to={'/website/clientVersions'} icon={'ri-git-branch-line'} tooltip={'Client versions'} />
            </>)}
        </ContentMenu>

        <Routes>
            <Route path="/connection" element={<ConnectionPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/layouts/:layoutId?/:groupId?/:buttonId?" element={<LayoutsPage />} />
            <Route path="/parameters" element={<ParametersPage />} />
            <Route path="/tiers" element={<TiersPage />} />

            {/* /!* Admin pages *!/ */}
            {/* <Route path="/approveFiles" element={<ApproveFilesPage />} /> */}
            {/* <Route path="/clientVersions" element={<UpdatesPage />} /> */}

            <Route path="*" element={<Navigate to={'/website/connection'} />} />
        </Routes>
    </>);
}
