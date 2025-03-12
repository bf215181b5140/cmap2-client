import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';
import ContentMenu from '../../components/menu/contentMenu/contentMenu.component';
import ContentMenuLink from '../../components/menu/contentMenu/contentMenuLink.component';
import { CredentialsContext } from '../../components/context/credentials.context';
import ProfilePage from './profile/profile.page';
import InteractionKeys from './layouts/layout/interactionKeys/interactionKeys.component';
import StylePage from './style/style.page';
import LayoutsPage from './layouts/layouts.page';
import ConnectionPage from './connection/connection.page';
import TiersPage from './tiers/tiers.page';

export default function WebsitePage() {

  const navigate = useNavigate();
  const location = useLocation();
  const { credentials: { apiToken } } = useContext(CredentialsContext);

  if (!apiToken && location.pathname !== '/website/connection') {
    navigate('/website/connection');
  }

  return (<>
    <ContentMenu>
      <ContentMenuLink to={'/website/connection'} icon={'ri-wifi-fill'} tooltip={'Connection'} />
      <ContentMenuLink to={'/website/profile'} icon={'ri-profile-fill'} tooltip={'Profile'} disabled={!apiToken} />
      <ContentMenuLink to={'/website/layouts'} icon={'ri-layout-masonry-fill'} tooltip={'Layouts'} disabled={!apiToken} />
      <ContentMenuLink to={'/website/menu'} icon={'ri-menu-line'} tooltip={'Profile menu'} disabled={!apiToken} />
      <ContentMenuLink to={'/website/style'} icon={'ri-paint-brush-fill'} tooltip={'Background and theme'} disabled={!apiToken} />
      <ContentMenuLink to={'/website/tiers'} icon={'ri-medal-fill'} tooltip={'Tiers & invite keys'} disabled={!apiToken} />

      {/* {isAdmin && (<> */}
      {/*   <hr /> */}
      {/*   <ContentMenuLink to={'/website/approveFiles'} icon={'ri-gallery-fill'} tooltip={'Approve file uploads'} /> */}
      {/*   <ContentMenuLink to={'/website/clientVersions'} icon={'ri-git-branch-line'} tooltip={'Client versions'} /> */}
      {/* </>)} */}
    </ContentMenu>

    <Routes>
      <Route path="/connection" element={<ConnectionPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/layouts/*" element={<LayoutsPage />} />
      <Route path="/style" element={<StylePage />} />
      <Route path="/tiers" element={<TiersPage />} />

      {/* /!* Admin pages *!/ */}
      {/* <Route path="/approveFiles" element={<ApproveFilesPage />} /> */}
      {/* <Route path="/clientVersions" element={<UpdatesPage />} /> */}

      <Route path="*" element={<Navigate to={'/website/connection'} />} />
    </Routes>
  </>);
}
