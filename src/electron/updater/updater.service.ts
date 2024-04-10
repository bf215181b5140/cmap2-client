import TypedIpcMain from '../ipc/typedIpcMain';
import { app } from 'electron';
import { spawn } from 'child_process';
import * as fs from 'fs';
import { Readable } from 'stream';
import { tmpName } from 'tmp-promise';

export default class UpdaterService {

    constructor() {
        TypedIpcMain.on('startUpdate', (data) => this.startUpdate(data));
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
