import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const topicsTable = pgTable('topics', {
    id: text('id').primaryKey(),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
    name: varchar('name').notNull(),
    userId: text('userId').notNull(),
});

export const topicsTableRelations = relations(topicsTable, ({ many }) => ({
    pullRequests: many(pullRequestsTable, {
        relationName: 'pullRequests',
    }),
    tasks: many(tasksTable, {
        relationName: 'tasks',
    }),
}));

export const pullRequestTypesPgEnum = pgEnum('pullRequestTypes', [
    'dev',
    'master',
    'beta',
]);

export const pullRequestsTable = pgTable('pullRequests', {
    id: text('id').primaryKey(),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
    url: varchar('url').notNull(),
    type: pullRequestTypesPgEnum('type').notNull(),
    topicId: text('topicId').notNull(),
});

export const pullRequestsTableRelations = relations(pullRequestsTable, ({ one }) => ({
    topic: one(topicsTable, {
        fields: [pullRequestsTable.topicId],
        references: [topicsTable.id],
        relationName: 'pullRequests',
    }),
}));

export const taskTypesPgEnum = pgEnum('taskTypes', ['main', 'test']);

export const tasksTable = pgTable('tasks', {
    id: text('id').primaryKey(),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
    url: varchar('url').notNull(),
    type: taskTypesPgEnum('type').notNull(),
    topicId: text('topicId').notNull(),
});

export const tasksTableRelations = relations(tasksTable, ({ one }) => ({
    topic: one(topicsTable, {
        fields: [tasksTable.topicId],
        references: [topicsTable.id],
        relationName: 'tasks',
    }),
}));
