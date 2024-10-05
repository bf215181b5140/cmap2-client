import { z } from 'zod';

export const WindowStateSchema = z.enum(['Open', 'Minimize', 'Tray', 'Exit']);

export type WindowState = z.infer<typeof WindowStateSchema>;