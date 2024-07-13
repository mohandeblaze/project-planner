import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { pullRequestsTable, tasksTable, topicsTable } from '../db/topicDbSchema';

export const pullRequestSchema = createInsertSchema(pullRequestsTable);
export const taskSchema = createInsertSchema(tasksTable);

export const topicSchema = createInsertSchema(topicsTable).merge(
    z.object({
        pullRequests: z.array(pullRequestSchema).default([]),
        tasks: z.array(taskSchema).default([]),
    }),
);

export type Topic = z.infer<typeof topicSchema>;
