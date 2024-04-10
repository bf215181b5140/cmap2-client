import { VersionDTO } from 'cmap2-shared';

export interface UpdateData {
    currentVersion: string;
    serverData: VersionDTO;
    newPatch: boolean;
    newMinor: boolean;
    newMajor: boolean;
}
