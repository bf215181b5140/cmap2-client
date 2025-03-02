import Drawer from '../drawer.component';
import React, { useEffect, useState } from 'react';
import { UpdaterData } from '../../../../electron/updater/updater.model';
import semver from 'semver';
import { NotificationType, NotificationTypeSchema } from 'cmap2-shared';
import DrawerItem from '../drawerItem.component';
import styled, { css } from 'styled-components';
import { theme } from 'cmap2-shared/react';

export default function UpdateDrawer() {

  const [updateData, setUpdateData] = useState<UpdaterData>();
  const [updateProgress, setUpdateProgress] = useState<number | false | undefined>();
  const updateInProgress = typeof updateProgress === 'number';
  const update = updateData?.update;

  useEffect(() => {
    const updateListener = window.IPC.receive('updater:update', data => setUpdateData(data));
    const progressListener = window.IPC.receive('updater:progress', data => setUpdateProgress(data === 1 ? undefined : data));

    window.IPC.send('updater:check');

    return () => {
      updateListener();
      progressListener();
    };
  }, []);

  const newUpdate = !!updateData?.update?.version && semver.lt(updateData?.currentVersion, updateData?.update?.version);
  const newMajor = !!updateData?.update?.version && semver.major(updateData?.update?.version) > semver.major(updateData?.currentVersion);
  const newMinor = !!updateData?.update?.version && semver.minor(updateData?.update?.version) > semver.minor(updateData?.currentVersion);
  const newPatch = !!updateData?.update?.version && semver.patch(updateData?.update?.version) > semver.patch(updateData?.currentVersion);

  function updateTitle(): string {
    if (newUpdate) {
      if (newMajor || newMinor) return 'Update required';
      if (newPatch) return 'Update available';
    }
    return 'Updates';
  }

  function updateSeverity(): NotificationType | undefined {
    if (updateInProgress) return NotificationTypeSchema.Values.Info;
    if (newUpdate) {
      if (newMajor) return NotificationTypeSchema.Values.Error;
      if (newMinor) return NotificationTypeSchema.Values.Warning;
      if (newPatch) return NotificationTypeSchema.Values.Info;
    }
    return undefined;
  }

  function updateAndInstall(url: string) {
    if (!updateInProgress) window.IPC.send('updater:downloadAndInstall', url);
  }

  return (<Drawer icon={'ri-download-2-fill'} title={updateTitle()} emptyMessage={'No new updates.'} notificationType={updateSeverity()}>
    {(newUpdate && update) && <DrawerUpdateItem notificationType={updateSeverity()} updateInProgress={updateInProgress} onClick={() => updateAndInstall(update.downloadUrl)}>

      <h2>{update.name}</h2>
      <p>{update.description}</p>

      {updateInProgress && <ProgressBar>
        <div style={{ width: updateProgress * 100 + '%' }} />
      </ProgressBar>}

      {updateProgress === false && <span style={{ color: theme.colors.error }}>Error during update install</span>}
      {!updateInProgress && <span style={{ color: 'dimgrey' }}>Click to download and install</span>}

    </DrawerUpdateItem>}
  </Drawer>);
}

const DrawerUpdateItem = styled(DrawerItem)<{ updateInProgress: boolean }>`
  cursor: pointer;
  
  ${props => props.updateInProgress && css`
    border-color: ${props => props.theme.colors.ui.element5};
    pointer-events: none;
  `}
  
  :hover {
    background: ${props => props.theme.colors.ui.background5};
    border-color: ${props => props.theme.colors.ui.element5};
  }

  span {
    display: block;
    margin-top: 5px;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  padding: 3px;
  margin: 6px 0;
  background: ${props => props.theme.colors.ui.appBg};
  border-radius: 4px;

  > div {
    display: block;
    content: '';
    height: 5px;
    animation: blink 1s ease-in infinite alternate;
    border-radius: 2px;

    @keyframes blink {
      0% {
        background: ${props => props.theme.colors.ui.element1};
      }
      100% {
        background: ${props => props.theme.colors.ui.element2};
      }
    }

  }
`;