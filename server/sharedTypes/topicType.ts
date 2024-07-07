import {
    pullRequestSchema,
    taskSchema,
    topicSchema,
} from '@/server/db/schema/topicSchema';
import { z } from 'zod';

const topicCreate = topicSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    pullRequests: true,
    tasks: true,
});

const pullRequestCreate = pullRequestSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

const taskCreate = taskSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export const topicCreateSchema = topicCreate.merge(
    z.object({
        pullRequests: z.array(pullRequestCreate).min(1),
        tasks: z.array(taskCreate).min(1),
    }),
);

export type TopicCreate = z.infer<typeof topicCreateSchema>;
