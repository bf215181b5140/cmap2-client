import { IPC } from '../ipc/typedIpc.service';
import { GitHubReleaseData, Update } from './updater.model';
import { app } from 'electron';
import { WEBSITE_URL } from '../../shared/const';
import * as fs from 'fs';
import { tmpName } from 'tmp-promise';
import log from 'electron-log';
import { z } from 'zod';
import * as https from 'node:https';
import { spawn } from 'child_process';

export default class UpdaterService {
  private intervalId: NodeJS.Timeout | null = null;
  private downloadInProgress = false;

  constructor() {
    IPC.on('updater:check', () => this.checkForUpdates());
    IPC.on('updater:downloadAndInstall', url => this.downloadAndInstall(url));

    this.manageInterval();
  }

  manageInterval() {
    // Check right away
    this.checkForUpdates();
    // If interval already exists return
    if (this.intervalId) return;
    // set new interval
    this.intervalId = setInterval(() => this.checkForUpdates(), 3600 * 1000);
  }

  /*
  * Contains logic for getting updates and emitting
  *
   */
  async checkForUpdates() {
    const apiUrl = await this.getGitHubLastestApiUrl();
    if (!apiUrl) return;
    const update = await this.getGitHubLastestUpdate(apiUrl);

    IPC.emit('updater:update', { currentVersion: app.getVersion(), lastCheck: new Date().toString(), update: update || null });
  }

  /*
  * Get api link to GihHub project latest release
  *
   */
  async getGitHubLastestApiUrl() {
    return await fetch(`${WEBSITE_URL}/api/updates/githubLatestApiUrl`, {
      method: 'GET',
    }).then(async res => {
      if (!res.ok) throw Error('Bad response from server');
      const data = await res.text();
      return z.string().parse(data);
    }).catch(err => {
      log.error('Something went wrong getting githubLatestApiUrl:', err);
    });
  }

  /*
  * Call GitHub api and get the data for latest release
  *
   */
  async getGitHubLastestUpdate(githubLatestApiUrl: string) {
    return await fetch(githubLatestApiUrl, {
      method: 'GET',
    }).then(async res => {
      if (!res.ok) throw Error('Bad response from server');
      const data = GitHubReleaseData.parse(await res.json());
      const update: Update = {
        version: data.tag_name,
        name: data.name,
        description: data.body,
        downloadUrl: data.assets[0].browser_download_url,
        date: data.assets[0].created_at
      };
      return update;
    }).catch(err => {
      log.error('Something went wrong getting latest release from github', err);
    });
  }

  /*
  * Download the update from provided url, emit events for progress and finally execute the file to update
  *
  * GitHub serves downloads using redirects so we have to follow them and download the file. But only follow redirect once
  *
   */
  async downloadAndInstall(url: string, redirect?: boolean) {
    // if there is a download already in progress we skip
    if (this.downloadInProgress && redirect !== true) return;
    this.downloadInProgress = true;

    // prepare file
    const savePath: string = await tmpName({ postfix: '.exe' });
    const file = fs.createWriteStream(savePath);
    let receivedBytes = 0;

    // request url
    https.get(url, (response) => {

      // if response contains a redirect, we have to follow it
      if ([301, 302, 307, 308].includes(response.statusCode || 0) && response.headers?.location) {
        // if we already redirected once then stop
        if (redirect) {
          IPC.emit('updater:progress', false);
          this.downloadInProgress = false;
          return;
        }

        // prepare new URL and call this function again, clean up prepared temp file
        const redirectUrl = new URL(response.headers.location, url).href;
        this.downloadAndInstall(redirectUrl, true);
        fs.unlink(savePath, () => {
        });
        return;
      }

      const totalBytes = parseInt(response.headers['content-length'] || '', 10) || 0;

      response.pipe(file);

      response.on('data', (chunk) => {
        receivedBytes += chunk.length;
        IPC.emit('updater:progress', receivedBytes / totalBytes);
      });

      file.on('finish', () => {
        file.close(() => {
          this.downloadInProgress = false;
          const process = spawn(savePath, [], { detached: true, stdio: 'ignore' });
          process.unref();
          app.quit();
        });
      });

      file.on('error', (err) => {
        log.error('Something went wrong downloading update:', err);
        IPC.emit('updater:progress', false);
        this.downloadInProgress = false;
        fs.unlink(savePath, () => {
        });
      });
    }).on('error', (err) => {
      log.error('Something went wrong downloading update:', err);
      IPC.emit('updater:progress', false);
      this.downloadInProgress = false;
    });
  }
}
