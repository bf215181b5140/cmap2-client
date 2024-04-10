import { z } from 'zod';

export const generalSettingsSchema = z.object({
    startMinimized: z.boolean(),
    enableVrcDetector: z.boolean(),
    vrcDetectorFrequency: z.number().min(1).max(3600),
    oscIp: z.string(),
    oscInPort: z.number(),
    oscOutPort: z.number(),
});

export const websocketSettingsSchema = z.object({
    autoLogin: z.boolean(),
});

export type GeneralSettings = z.infer<typeof generalSettingsSchema>;
export type WebsocketSettings = z.infer<typeof websocketSettingsSchema>;

export type Settings = {
    general: GeneralSettings
    websocket: WebsocketSettings
}
