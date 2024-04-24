import TypedIpcMain from '../ipc/typedIpcMain';
import { WEBSITE_URL } from '../../shared/const';
import { app } from 'electron';
import { spawn } from 'child_process';
import * as fs from 'fs';
import { Readable } from 'stream';
import { tmpName } from 'tmp-promise';
import { UpdateSchema } from 'cmap2-shared';
import { UpdateData } from './updater.model';

export default class UpdaterService {
    private intervalId: NodeJS.Timeout | null = null;
    private updateData: UpdateData = {
        currentVersion: app.getVersion(),
        lastCheck: undefined,
        latest: undefined,
    };

    constructor() {
        TypedIpcMain.on('checkForUpdates', (manual) => this.checkForUpdates());
        TypedIpcMain.on('startUpdate', (data) => this.startUpdate(data));

        this.manageInterval();
    }

    manageInterval() {
        // Check right away
        this.checkForUpdates();
        // If interval already exists return
        if (this.intervalId) return;
        // set new interval
        this.intervalId = setInterval(() => this.checkForUpdates(), 1800 * 1000);
    }

    async checkForUpdates() {
        let data = await fetch(`${WEBSITE_URL}/api/updates`, {
            method: 'GET',
        }).then(async res => {
            if (res.ok) {
                const data = await res.json();
                return UpdateSchema.parse(data);
            }
        }).catch(() => {
            console.log('error fetching version check');
            return undefined;
        });

        this.updateData = {
            currentVersion: app.getVersion(),
            lastCheck: !!data ? Date.now() : undefined,
            latest: data,
        };

        TypedIpcMain.emit('updateData', this.updateData);
    }

    async startUpdate(downloadUrl: string) {
        const installerPath: string = await tmpName({ postfix: '.exe' });

        const response = await fetch(downloadUrl);
        // @ts-ignore
        const body = Readable.fromWeb(response.body);
        await fs.promises.writeFile(installerPath, body);

        spawn(installerPath, [], {
            detached: true,
            stdio: 'ignore'
        });

        app.exit(0);
    }
}
