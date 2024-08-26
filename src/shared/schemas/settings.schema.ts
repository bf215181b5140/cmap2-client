import { z } from 'zod';
import { WindowSize } from '../enums';

export const AppSettingsSchema = z.object({
    startOnBoot: z.boolean(),
    startInBackground: z.boolean(),
    windowSize: z.nativeEnum(WindowSize),
})

export type AppSettings = z.infer<typeof AppSettingsSchema>;

export const VrcDetectorSettingsSchema = z.object({
    detect: z.boolean(),
    frequency: z.number(),
})

export type VrcDetectorSettings = z.infer<typeof VrcDetectorSettingsSchema>;