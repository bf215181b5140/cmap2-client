import { z } from 'zod';

export const VrcOscAvatarParameterPropertiesSchema = z.object({
  address: z.string(),
  type: z.enum(['Int', 'Float', 'Bool']),
});

export type VrcOscAvatarParameterProperties = z.infer<typeof VrcOscAvatarParameterPropertiesSchema>;

export const VrcOscAvatarParameterSchema = z.object({
  name: z.string(),
  input: VrcOscAvatarParameterPropertiesSchema.optional(),
  output: VrcOscAvatarParameterPropertiesSchema.optional(),
});

export type VrcOscAvatarParameter = z.infer<typeof VrcOscAvatarParameterSchema>;

export const VrcOscAvatarSchema = z.object({
  id: z.string(),
  name: z.string(),
  parameters: z.array(VrcOscAvatarParameterSchema),
});

export type VrcOscAvatar = z.infer<typeof VrcOscAvatarSchema>;
