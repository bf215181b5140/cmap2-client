import { app, Menu, Tray } from 'electron';
import { BRIDGE } from '../bridge/bridge.service';

export class TrayController extends Tray {

  constructor() {
    super('resources/icon.png');

    this.setToolTip('Change my avatar params');

    this.setContextMenu(Menu.buildFromTemplate([
      { label: 'Open', click: () => BRIDGE.emit('setWindowState', 'Open') },
      { label: 'Minimize', click: () => BRIDGE.emit('setWindowState', 'Minimize') },
      { label: 'Tray', click: () => BRIDGE.emit('setWindowState', 'Tray') },
      { type: 'separator', },
      {
        label: 'Resize', type: 'submenu', submenu: [
          { label: 'Big', click: () => BRIDGE.emit('setWindowSize', 'Big') },
          { label: 'Medium', click: () => BRIDGE.emit('setWindowSize', 'Medium') },
          { label: 'Small', click: () => BRIDGE.emit('setWindowSize', 'Small') },
        ]
      },
      { type: 'separator', },
      {
        label: 'Exit', click: () => {
          this.destroy();
          app.quit();
        }
      }
    ]));

    this.on('double-click', () => {
      BRIDGE.emit('setWindowState', 'Open');
    });
  }
}