import TypedIpcMain from '../ipc/typedIpcMain';
import { StoreService } from '../store/store.service';
import { WEBSITE_URL } from '../../shared/const';
import semver from 'semver';
import { app } from 'electron';
import { spawn } from 'child_process';
import * as fs from 'fs';
import { GeneralSettings } from '../../shared/types/settings';
import { Readable } from 'stream';
import { tmpName } from 'tmp-promise';
import { UpdatesDTO } from 'cmap2-shared';
import { UpdateData } from './update.model';

export default class UpdateService {
    private intervalId: NodeJS.Timeout | null = null;
    private updateData: UpdateData | undefined;

    constructor() {
        TypedIpcMain.on('setGeneralSettings', (data) => this.manageInterval(data));
        TypedIpcMain.on('checkForUpdate', () => this.checkForUpdates());
        TypedIpcMain.on('startUpdate', (data) => this.startUpdate(data));

        this.manageInterval(StoreService.getGeneralSettings());
    }

    manageInterval(settings: GeneralSettings) {
        if (settings.autoCheckUpdates) {
            // Check right away
            this.checkForUpdates();
            // If interval already exists return
            if (this.intervalId) return;
            // set new interval
            this.intervalId = setInterval(() => this.checkForUpdates(), 3600 * 1000);
        } else {
            // Clear existing interval
            if (this.intervalId) clearInterval(this.intervalId);
        }
    }

    async checkForUpdates() {
        const currentVersion = app.getVersion();

        const data = await fetch(`${WEBSITE_URL}/api/updates?version=${currentVersion}`, {
            method: 'GET',
        }).then(async res => {
            if (res.ok) {
                    return await res.json() as UpdatesDTO;
            }
        }).catch(() => {
            console.log('error fetching version check');
            return undefined;
        });

        if (!data) return;

        this.updateData = {
            currentVersion: currentVersion,
            lastCheck: Date.now(),
            updates: data.updates,
            newMajor: !!data.updates.find(u => semver.major(u.version) > semver.major(currentVersion)),
            newMinor: !!data.updates.find(u => semver.minor(u.version) > semver.minor(currentVersion)),
            newPatch: !!data.updates.find(u => semver.patch(u.version) > semver.patch(currentVersion)),
        }

        TypedIpcMain.emit('updateData', this.updateData)
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
