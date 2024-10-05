import { app, Menu, Tray } from 'electron';
import { BRIDGE } from '../bridge/bridge.service';
import { WindowSize } from '../../shared/enums/windowSize';
import { WindowState } from '../../shared/enums/windowState';

export class TrayController extends Tray {

    constructor() {
        super('resources/icon.png');

        this.setToolTip('Change my avatar params');

        this.setContextMenu(Menu.buildFromTemplate([
            { label: 'Open', click: () => BRIDGE.emit('setWindowState', WindowState.Open) },
            { label: 'Minimize', click: () => BRIDGE.emit('setWindowState', WindowState.Minimize) },
            { label: 'Tray', click: () => BRIDGE.emit('setWindowState', WindowState.Tray) },
            { type: 'separator', },
            {
                label: 'Resize', type: 'submenu', submenu: [
                    { label: 'Big', click: () => BRIDGE.emit('setWindowSize', WindowSize.Big) },
                    { label: 'Medium', click: () => BRIDGE.emit('setWindowSize', WindowSize.Medium) },
                    { label: 'Small', click: () => BRIDGE.emit('setWindowSize', WindowSize.Small) },
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
            BRIDGE.emit('setWindowState', WindowState.Open);
        });
    }
}