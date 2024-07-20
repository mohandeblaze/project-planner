import { z } from 'zod'
import { taskTypesPgEnum } from '../db/topicDbSchema'

export type EditTaskSchemaType = z.infer<typeof EditTaskSchema>
export type MainEditTaskSchemaType = z.infer<typeof MainEditTaskSchema>
export type EditTaskWithTypeSchemaType = z.infer<typeof EditTaskWithTypeSchema>

export const EditTaskSchema = z.object({
    tasks: z.array(
        z.object({
            url: z.string().url(),
        }),
    ),
})

export const MainEditTaskSchema = EditTaskSchema.extend({
    tasks: EditTaskSchema.shape.tasks.min(1, 'At least one main task is required'),
})

export const EditTaskWithTypeSchema = EditTaskSchema.extend({
    type: z.enum(taskTypesPgEnum.enumValues),
})

export const EditPullRequestsSchema = z.object({
    pullRequests: z.array(
        z.object({
            url: z.string().url(),
        }),
    ),
})
