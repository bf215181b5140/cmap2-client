import { z } from 'zod';

export const settingsSchema = z.object({
    startMinimized: z.boolean(),
    autoLogin: z.boolean(),
    enableVrcDetector: z.boolean(),
    vrcDetectorFrequency: z.number().min(1).max(3600),
    oscIp: z.string(),
    oscInPort: z.number(),
    oscOutPort: z.number(),
});

// after form validation
export type Settings = z.infer<typeof settingsSchema>;
