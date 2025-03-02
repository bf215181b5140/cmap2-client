import { app } from 'electron';
import { WindowController } from './window/window.controller';
import { TrayController } from './tray/tray.controller';
import log from 'electron-log';
import contextMenu from 'electron-context-menu';
import GameDetectorController from './gameDetector/gameDetectorController';
import { SocketController } from './socket/socket.controller';
import { AVATARS } from './store/avatars/avatars.store';
import { OscController } from './osc/osc.controller';
import { UtilityController } from './utility/utility.controller';
import { NotificationsStore } from './store/notifications/notifications.store';
import UpdaterService from './updater/updater.service';
import { TrackedParametersService } from './trackedParameters/trackedParameters.service';

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.whenReady().then(() => {

  // Start logging (electron events)
  log.initialize();
  log.info('Application started');
  log.eventLogger.startLogging();

  // Stores
  new NotificationsStore();
  AVATARS;

  // start functions
  new GameDetectorController();
  new SocketController();
  new OscController();
  new TrackedParametersService();
  new UtilityController();
  new UpdaterService();

  // create window and tray
  new WindowController();
  new TrayController();

  // Context menu for development
  if (!app.isPackaged) contextMenu();

  // prevent terminating main process so program can run in background
  app.on('window-all-closed', (event: any) => event.preventDefault());

}).catch(e => log.error('Application failed to start', e));
