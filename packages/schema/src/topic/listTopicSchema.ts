import { z } from 'zod'
import { topicSchema } from './topicSchema'

const topic = topicSchema.pick({
    id: true,
    name: true,
})

export const ListTopicSchema = topic

export type ListTopicSchemaType = z.infer<typeof ListTopicSchema>
