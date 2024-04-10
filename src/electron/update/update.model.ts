import { UpdateDTO } from 'cmap2-shared';

export interface UpdateData {
    currentVersion: string;
    lastCheck: number;
    updates: UpdateDTO[];
    newMajor: boolean;
    newMinor: boolean;
    newPatch: boolean;
}
