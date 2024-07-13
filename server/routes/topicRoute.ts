import {
    clerkUserMiddleware,
    type UserVar,
} from '@/server/middleware/clerkUserMiddleware';
import { prefixId } from '@/server/utils';
import { zValidator } from '@hono/zod-validator';
import { createTopicSchema, topicDbSchema } from '@project-planner/shared-schema';
import { eq } from 'drizzle-orm';
import { Hono, type Context } from 'hono';
import { z } from 'zod';
import { dbClient } from '../db-client';
import { topicMapper } from '../mapper/topicMapper';

async function listTopicsHandler(c: Context<UserVar>) {
    const topics = await dbClient.query.topicsTable.findMany({
        limit: 20,
        with: {
            pullRequests: {
                columns: {
                    id: true,
                    url: true,
                    type: true,
                },
            },
        },
    });

    return c.json({
        topics: topics,
    });
}

export const topicRoute = new Hono()
    .get('/', clerkUserMiddleware, listTopicsHandler)
    .post('/', clerkUserMiddleware, zValidator('json', createTopicSchema), async (c) => {
        const topic = c.req.valid('json');

        const topicId = prefixId('topic');
        const topicModel = topicMapper.mapToModel(topicId, topic);

        dbClient.transaction(async (trx) => {
            await trx.insert(topicDbSchema.topicsTable).values(topicModel);

            if (topicModel.pullRequests.length > 0) {
                await trx
                    .insert(topicDbSchema.pullRequestsTable)
                    .values(topicModel.pullRequests);
            }

            if (topicModel.tasks.length > 0) {
                await trx.insert(topicDbSchema.tasksTable).values(topicModel.tasks);
            }
        });

        return c.json({ topicId }, 201);
    })
    .get(
        '/:id',
        clerkUserMiddleware,
        zValidator(
            'param',
            z.object({
                id: z.string(),
            }),
        ),
        async (c) => {
            const topic = await dbClient.query.topicsTable.findFirst({
                where: eq(topicDbSchema.topicsTable.id, c.req.valid('param').id),
            });

            if (!topic) {
                return c.json({ message: 'Not Found' }, 404);
            }

            return c.json({ topic });
        },
    );
