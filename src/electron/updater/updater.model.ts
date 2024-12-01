import { UpdateDTO } from 'cmap2-shared';

export interface UpdateData {
  currentVersion: string;
  lastCheck: number | undefined;
  latest: UpdateDTO | undefined;
}
