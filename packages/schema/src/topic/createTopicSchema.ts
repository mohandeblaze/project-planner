import { z } from 'zod';
import { pullRequestSchema, taskSchema, topicSchema } from './topicSchema';

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

export const createTopicSchema = topicCreate.merge(
    z.object({
        pullRequests: z.array(pullRequestCreate).min(1),
        tasks: z.array(taskCreate).min(1),
    }),
);

export type createTopicSchemaType = z.infer<typeof createTopicSchema>;