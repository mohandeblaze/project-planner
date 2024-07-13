import { z } from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { pullRequestsTable, tasksTable, topicsTable } from '../db/topicDbSchema'

export const pullRequestSchema = createInsertSchema(pullRequestsTable, {
    url: z.string().trim().url(),
})

export const taskSchema = createInsertSchema(tasksTable, {
    url: z.string().trim().url(),
})

export const topicSchema = createInsertSchema(topicsTable, {
    name: z.string().trim().min(3),
}).merge(
    z.object({
        pullRequests: z.array(pullRequestSchema).default([]),
        tasks: z.array(taskSchema).default([]),
    }),
)

export type Topic = z.infer<typeof topicSchema>
export type PullRequest = z.infer<typeof pullRequestSchema>
export type Task = z.infer<typeof taskSchema>
export type PullRequestType = Pick<PullRequest, 'type'>['type']
export type TaskType = Pick<Task, 'type'>['type']
