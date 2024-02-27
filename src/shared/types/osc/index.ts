import { z } from 'zod';

export interface OscSettings {
    oscIp: string;
    oscInPort: number;
    oscOutPort: number;
}

export const VrcOscAvatarParameterPropertiesSchema = z.object({
    address: z.string(),
    type: z.enum(['Int', 'Float', 'Bool']),
});

export const VrcOscAvatarParameterSchema = z.object({
    name: z.string(),
    input: VrcOscAvatarParameterPropertiesSchema.optional(),
    output: VrcOscAvatarParameterPropertiesSchema.optional(),
});

export const VrcOscAvatarSchema = z.object({
    id: z.string(),
    name: z.string(),
    parameters: z.array(VrcOscAvatarParameterSchema),
});

export type VrcOscData = { avatars: VrcOscAvatar[]; }

export type VrcOscAvatar = z.infer<typeof VrcOscAvatarSchema>;

export type VrcOscAvatarParameter = z.infer<typeof VrcOscAvatarParameterSchema>;

export type VrcOscAvatarParameterProperties = z.infer<typeof VrcOscAvatarParameterPropertiesSchema>;

