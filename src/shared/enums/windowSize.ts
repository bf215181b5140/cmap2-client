import { z } from 'zod';

export const WindowSizeSchema = z.enum(['Large', 'Medium', 'Small']);

export type WindowSize = z.infer<typeof WindowSizeSchema>;