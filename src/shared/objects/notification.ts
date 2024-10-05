import { NotificationTypeSchema } from 'cmap2-shared';
import { z } from 'zod';

export const NotificationSchema = z.object({
    id: z.string(),
    type: NotificationTypeSchema,
    message: z.string(),
    group: z.string().optional(),
    dateTime: z.string(),
});

export type Notification = z.infer<typeof NotificationSchema>;
