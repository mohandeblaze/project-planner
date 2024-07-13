import { z } from 'zod'
import { pullRequestSchema, taskSchema, topicSchema } from './topicSchema'

const topicCreate = topicSchema.pick({
    id: true,
    name: true,
})

const pullRequestCreate = pullRequestSchema.pick({
    id: true,
    type: true,
    url: true,
})

const taskCreate = taskSchema.pick({
    id: true,
    type: true,
    url: true,
})

export const ListTopicSchema = topicCreate.merge(
    z.object({
        pullRequests: z.array(pullRequestCreate).default([]),
        tasks: z.array(taskCreate).default([]),
    }),
)

export type ListTopicSchemaType = z.infer<typeof ListTopicSchema>
