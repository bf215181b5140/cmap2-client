import { z } from 'zod';
import { WindowSizeSchema } from '../enums/windowSize';

export const AppSettingsSchema = z.object({
    startOnBoot: z.boolean(),
    startInBackground: z.boolean(),
    windowSize: WindowSizeSchema,
});

export type AppSettings = z.infer<typeof AppSettingsSchema>;

export const VrcDetectorSettingsSchema = z.object({
    detect: z.boolean(),
    frequency: z.number(),
});

export type VrcDetectorSettings = z.infer<typeof VrcDetectorSettingsSchema>;

export const OscSettingsSchema = z.object({
    ip: z.string().ip(),
    inPort: z.number(),
    outPort: z.number(),
});

export type OscSettings = z.infer<typeof OscSettingsSchema>;

export const TrackedParametersSettingsSchema = z.object({
    clearOnAvatarChange: z.boolean(),
});

export type TrackedParametersSettings = z.infer<typeof TrackedParametersSettingsSchema>;

export const SocketSettingsSchema = z.object({
    autoConnect: z.boolean(),
});

export type SocketSettings = z.infer<typeof SocketSettingsSchema>;

export const SocketParameterBlacklistSchema = z.array(z.string());

export type SocketParameterBlacklist = z.infer<typeof SocketParameterBlacklistSchema>;