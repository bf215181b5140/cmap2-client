import { UpdateDTO } from 'cmap2-shared';

export interface UpdaterSettings {
    autoCheckUpdates: boolean;
}

export interface UpdaterData {
    currentVersion: string;
    lastCheck: number | undefined;
    updates: UpdateDTO[];
    newMajor: boolean;
    newMinor: boolean;
    newPatch: boolean;
}
