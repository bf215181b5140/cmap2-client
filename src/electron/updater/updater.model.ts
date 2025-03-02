import { z } from 'zod';

export const GitHubReleaseData = z.object({
  tag_name: z.string(),
  name: z.string(),
  body: z.string(),
  assets: z.array(z.object({
    name: z.string(),
    created_at: z.string(),
    browser_download_url: z.string(),
  })).min(1)
});

export type GitHubReleaseDataDTO = z.infer<typeof GitHubReleaseData>;

export interface Update {
  version: string;
  name: string;
  description: string;
  downloadUrl: string;
  date: string;
}

export interface UpdaterData {
  currentVersion: string,
  lastCheck: string,
  update: Update | null,
};

