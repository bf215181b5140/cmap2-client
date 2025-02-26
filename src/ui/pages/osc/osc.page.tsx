import { Navigate, Route, Routes } from 'react-router-dom';
import React from 'react';
import ContentMenu from '../../components/menu/contentMenu/contentMenu.component';
import ContentMenuLink from '../../components/menu/contentMenu/contentMenuLink.component';
import DebugPage from './debug/debug.page';
import StatusPage from './status/status.page';
import ParametersPage from './parameters/parameters.page';

export default function OscPage() {

  return (<>
    <ContentMenu>
      <ContentMenuLink to={'/osc/status'} icon={'ri-wifi-fill'} tooltip={'Status'} />
      <ContentMenuLink to={'/osc/parameters'} icon={'ri-list-check'} tooltip={'Parameters'} />
      <ContentMenuLink to={'/osc/debug'} icon={'ri-terminal-box-line'} tooltip={'Debug'} />
    </ContentMenu>
    <Routes>
      <Route path="/status" element={<StatusPage />} />
      <Route path="/parameters" element={<ParametersPage />} />
      <Route path="/debug" element={<DebugPage />} />
      <Route path="*" element={<Navigate to={'/osc/status'} />} />
    </Routes>
  </>);
}
