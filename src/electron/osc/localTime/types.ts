import { z } from 'zod';

export const LocalTimeAvatarParametersSchema = z.object({
    path: z.string(),
    unit: z.enum(["second", "minute", "hour", "day", "month", "year"]),
});

export const LocalTimeSettingsSchema = z.object({
    format24h: z.boolean(),
    sendToChatbox: z.boolean(),
    chatboxFormat: z.string(),
    sendToAvatar: z.boolean(),
    avatarParameters: z.array(LocalTimeAvatarParametersSchema),
});

export type LocalTimeAvatarParameters = z.infer<typeof LocalTimeAvatarParametersSchema>;

export type LocalTimeSettings = z.infer<typeof LocalTimeSettingsSchema>;
