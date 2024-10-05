import { z } from 'zod';

export const WindowSizeSchema = z.enum(['Big', 'Medium', 'Small']);

export type WindowSize = z.infer<typeof WindowSizeSchema>;