import { Navigate, Route, Routes } from 'react-router-dom';
import React from 'react';
import ContentMenu from '../../components/menu/contentMenu/contentMenu.component';
import ContentMenuLink from '../../components/menu/contentMenu/contentMenuLink.component';
import GameStatusPage from './gameStatus/gameStatus.page';
import AvatarsPage from '../avatars/avatars.page';
import DebugPage from './debug/debug.page';

export default function OscPage() {

  return (<>
    <ContentMenu>
      <ContentMenuLink to={'/osc/status'} icon={'ri-wifi-fill'} tooltip={'Game status'} />
      <ContentMenuLink to={'/osc/debug'} icon={'ri-terminal-box-line'} tooltip={'Debug'} />
    </ContentMenu>
    <Routes>
      <Route path="/status" element={<GameStatusPage />} />
      <Route path="/debug" element={<DebugPage />} />
      <Route path="*" element={<Navigate to={'/osc/status'} />} />
    </Routes>
  </>);
}
