import TypedIpcMain from '../ipc/typedIpcMain';
import { StoreService } from '../store/store.service';
import { WEBSITE_URL } from '../../shared/const';
import semver from 'semver';
import { app, dialog } from 'electron';
import { spawn } from 'child_process';
import * as fs from 'fs';
import { GeneralSettings } from '../../shared/types/settings';
import { Readable } from 'stream';

export default class UpdateService {
    private intervalId: NodeJS.Timeout | null = null;

    constructor() {
        TypedIpcMain.on('checkForUpdate', (force) => this.checkForUpdates(force));
        TypedIpcMain.on('setGeneralSettings', (data) => this.manageInterval(data));

        this.manageInterval(StoreService.getGeneralSettings());
    }

    manageInterval(settings: GeneralSettings) {
        if (settings.autoCheckUpdates) {
            // Check right away
            this.checkForUpdates(true);
            // If interval already exists return
            if (this.intervalId) return;
            // set new interval
            this.intervalId = setInterval(() => this.checkForUpdates(false), 3600 * 1000);
        } else {
            // Clear existing interval
            if (this.intervalId) clearInterval(this.intervalId);
        }
    }

    async checkForUpdates(forced: boolean) {
        if (!forced && !StoreService.getGeneralSettings().autoCheckUpdates) return;

        const version = await fetch(`${WEBSITE_URL}/api/version`, {
            method: 'GET',
        }).then(async res => {
            if (res.ok) {
                return await res.json();
            }
        }).catch(() => console.log('error fetching version check'));

        if (typeof version?.clientVersion !== 'string' || typeof version?.clientDownload !== 'string') return;

        if (semver.lte(version.clientVersion, app.getVersion())) return;

        const downloadUrl: string = version.clientDownload;
        const installerPath: string = './installer-latest.exe';

        const dialogRes = await dialog.showMessageBox({
            title: 'New update',
            message: 'New version is available, it might have new feature and website might not be compatible with old version of the program.',
            buttons: ['Download and install', 'Not now'],
            cancelId: 1
        });

        if (dialogRes.response === 1) return;

        const response = await fetch(downloadUrl);
        // @ts-ignore
        const body = Readable.fromWeb(response.body);
        await fs.promises.writeFile(installerPath, body);

        const installerProcess = spawn(installerPath, [], {
            detached: true,
            stdio: 'ignore'
        });

        // Unreference the child process so it can run independently
        installerProcess.unref();

        app.exit(0);
    }
}
