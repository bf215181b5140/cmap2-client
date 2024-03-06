import { Route, Routes, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import React from 'react';
import Submenu from '../../shared/components/submenu/submenu.component';
import SubmenuLink from '../../shared/components/submenu/submenuLink.component';
import VrcStatusPage from './vrcStatus/vrcStatus.page';
import ClockPage from './clock/clock.page';
import AvatarsPage from './avatars/avatars.page';

export default function OscPage() {

    return (<OscPageStyled>
        <Submenu>
            <SubmenuLink to={'/osc/status'} icon={'ri-wifi-fill'} />
            <SubmenuLink to={'/osc/avatars'} icon={'ri-contacts-book-fill'} />
            <SubmenuLink to={'/osc/clock'} icon={'ri-time-line'} />
        </Submenu>

        <div style={{flexBasis: '100%'}}>
            <Routes>
                <Route path="/status" element={<VrcStatusPage />} />
                <Route path="/avatars" element={<AvatarsPage />} />
                <Route path="/clock" element={<ClockPage />} />
                <Route path="*" element={<Navigate to={'/osc/status'} />} />
            </Routes>
        </div>
    </OscPageStyled>);
}

const OscPageStyled = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  flex: 1;
`;
