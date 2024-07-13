import { z } from 'zod'
import { pullRequestSchema, taskSchema, topicSchema } from './topicSchema'

const topicCreate = topicSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
})

const pullRequestCreate = pullRequestSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    topicId: true,
})

const taskCreate = taskSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    topicId: true,
})

export const createTopicSchema = topicCreate.merge(
    z.object({
        pullRequests: z.array(pullRequestCreate).default([]),
        tasks: z.array(taskCreate).min(1, 'At least one task is required').default([]),
    }),
)

export type createTopicSchemaType = z.infer<typeof createTopicSchema>
