import { z } from 'zod';

export enum OscClockUnit {
    Second = 'second',
    Minute = 'minute',
    Hour = 'hour',
    Day = 'day',
    Month = 'month',
    Year = 'year',
}

export const OscClockAvatarParametersSchema = z.object({
    path: z.string(),
    unit: z.nativeEnum(OscClockUnit),
});

export const OscClockSettingsSchema = z.object({
    sendToChatbox: z.boolean(),
    chatboxFormat: z.string(),
    sendToAvatar: z.boolean(),
    avatarParameters: z.array(OscClockAvatarParametersSchema),
});

export type OscClockAvatarParameters = z.infer<typeof OscClockAvatarParametersSchema>;

export type OscClockSettings = z.infer<typeof OscClockSettingsSchema>;

export const OscClockSettingsDefaults = {
    sendToChatbox: false,
    chatboxFormat: 'My time: {time}',
    sendToAvatar: false,
    avatarParameters: []
}
