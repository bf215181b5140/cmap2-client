import { app, nativeImage } from 'electron';
import { WindowController } from './window/window.controller';
import { TrayController } from './tray/tray.controller';
import log from 'electron-log';
import contextMenu from 'electron-context-menu';
import GameDetectorController from './gameDetector/gameDetectorController';
import { SocketController } from './socket/socket.controller';
import { AVATARS } from './store/avatars/avatars.store';
import { OscController } from './osc/osc.controller';
import { UtilityController } from './utility/utility.controller';
import UpdaterService from './updater/updater.service';
import { TrackedParametersService } from './trackedParameters/trackedParameters.service';
import { IS_DEV } from '../shared/const';

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.whenReady().then(() => {

  // Start logging (electron events)
  log.initialize();
  log.info('Application started');
  log.eventLogger.startLogging();

  // Stores
  AVATARS;

  // start functions
  new GameDetectorController();
  new SocketController();
  new OscController();
  new TrackedParametersService();
  new UtilityController();
  new UpdaterService();

  // create window
  new WindowController();

  // Start tray
  const trayIconPath = IS_DEV ? 'resources/icon.png' : `${process.resourcesPath}/icon.png`;
  const trayIcon = nativeImage.createFromPath(trayIconPath)
  new TrayController(trayIcon);

  // Context menu for development
  if (!app.isPackaged) contextMenu();

  // prevent terminating main process so program can run in background
  app.on('window-all-closed', (event: any) => event.preventDefault());

}).catch(e => log.error('Application failed to start', e));
