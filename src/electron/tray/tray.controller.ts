import { app, Menu, Tray, NativeImage } from 'electron';
import { BRIDGE } from '../bridge/bridge.service';

export class TrayController extends Tray {

  constructor(nativeImage: NativeImage) {
    super(nativeImage);

    this.setToolTip('Change my avatar params');

    this.setContextMenu(Menu.buildFromTemplate([
      { label: 'Open', click: () => BRIDGE.emit('window:state', 'Open') },
      { label: 'Minimize', click: () => BRIDGE.emit('window:state', 'Minimize') },
      { label: 'Tray', click: () => BRIDGE.emit('window:state', 'Tray') },
      { type: 'separator', },
      {
        label: 'Resize', type: 'submenu', submenu: [
          { label: 'Large', click: () => BRIDGE.emit('window:size', 'Large') },
          { label: 'Medium', click: () => BRIDGE.emit('window:size', 'Medium') },
          { label: 'Small', click: () => BRIDGE.emit('window:size', 'Small') },
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
      BRIDGE.emit('window:state', 'Open');
    });
  }
}