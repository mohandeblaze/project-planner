import { UTCDate } from '@date-fns/utc';
import { z } from 'zod';

export const pullRequestSchema = z.object({
    id: z.string(),
    createdAt: z.date().default(new UTCDate()),
    updatedAt: z.date().default(new UTCDate()),
    url: z.string().url(),
    type: z.enum(['dev', 'master', 'beta']),
});

export const taskSchema = z.object({
    id: z.string(),
    createdAt: z.date().default(new UTCDate()),
    updatedAt: z.date().default(new UTCDate()),
    url: z.string().url(),
    type: z.enum(['main', 'test']),
});

export const topicSchema = z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.date().default(new UTCDate()),
    updatedAt: z.date().default(new UTCDate()),
    pullRequests: z.array(pullRequestSchema).min(1),
    tasks: z.array(taskSchema).min(1),
});

export type Topic = z.infer<typeof topicSchema>;
