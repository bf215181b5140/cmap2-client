import { z } from 'zod';
import { WindowSizeSchema } from '../enums/windowSize';

export const AppSettingsSchema = z.object({
  startOnBoot: z.boolean(),
  startInBackground: z.boolean(),
  windowSize: WindowSizeSchema,
});

export type AppSettings = z.infer<typeof AppSettingsSchema>;

export const GameDetectorSettingsSchema = z.object({
  detectVRChat: z.boolean(),
  detectChilloutVR: z.boolean(),
  frequency: z.number(),
});

export type GameDetectorSettings = z.infer<typeof GameDetectorSettingsSchema>;

export const OscSettingsSchema = z.object({
  ip: z.string().ip(),
  inPort: z.number(),
  outPort: z.number(),
});

export type OscSettings = z.infer<typeof OscSettingsSchema>;

export const TrackedParametersSettingsSchema = z.object({
  clearOnAvatarChange: z.boolean(),
  blacklist: z.array(z.string()),
});

export type TrackedParametersSettings = z.infer<typeof TrackedParametersSettingsSchema>;

export const SocketSettingsSchema = z.object({
  autoConnect: z.boolean(),
});

export type SocketSettings = z.infer<typeof SocketSettingsSchema>;
