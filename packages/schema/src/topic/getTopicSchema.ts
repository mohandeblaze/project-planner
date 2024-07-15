import { z } from 'zod'
import { pullRequestSchema, taskSchema, topicSchema } from './topicSchema'

const topic = topicSchema.pick({
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

export const GetTopicSchema = topic.merge(
    z.object({
        pullRequests: z.array(pullRequestCreate).default([]),
        tasks: z.array(taskCreate).default([]),
    }),
)

export type GetTopicSchemaType = z.infer<typeof GetTopicSchema>
