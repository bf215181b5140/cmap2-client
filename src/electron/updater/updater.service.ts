import { IPC } from '../ipc/typedIpc.service';
import { UpdateData } from './updater.model';
import { app } from 'electron';
import { WEBSITE_URL } from '../../shared/const';
import { spawn } from 'child_process';
import * as fs from 'fs';
import { Readable } from 'stream';
import { tmpName } from 'tmp-promise';
import log from 'electron-log';
import { z } from 'zod';

export default class UpdaterService {
  private intervalId: NodeJS.Timeout | null = null;
  private updateData: UpdateData = {
    currentVersion: app.getVersion(),
    lastCheck: undefined,
    latest: undefined,
  };

  constructor() {
    IPC.on('updater:check', () => this.checkForUpdates());
    IPC.on('updater:start', (data) => this.startUpdate(data));

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
        const contentType = res.headers.get('Content-Type');
        if (contentType?.startsWith('application/json')) {
          const data = await res.json();

          // todo UpdateSchema gives error even if it's never executed???
          return z.object({
            id: z.string(),
            version: z.string(),
            download: z.string(),
            description: z.string(),
            date: z.coerce.date(),
          }).parse(data);
        }
      }
      return undefined;
    }).catch(() => {
      log.error('Something went wrong getting updates from server');
      return undefined;
    });

    this.updateData = {
      currentVersion: app.getVersion(),
      lastCheck: !!data ? Date.now() : undefined,
      latest: data,
    };

    IPC.emit('updater:data', this.updateData);
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
