import {
    clerkUserMiddleware,
    type UserVar,
} from '@/server/middleware/clerkUserMiddleware';
import { prefixId } from '@/server/utils';
import { zValidator } from '@hono/zod-validator';
import {
    createTopicSchema,
    topicDbSchema,
    type createTopicSchemaType,
} from '@project-planner/shared-schema';
import assert from 'assert';
import { and, eq } from 'drizzle-orm';
import { Hono, type Context } from 'hono';
import { z } from 'zod';
import { dbClient } from '../db-client';
import { topicMapper } from '../mapper/topicMapper';

export const topicRoute = new Hono()
    .get('/', clerkUserMiddleware, listTopicsHandler)
    .post('/', clerkUserMiddleware, zValidator('json', createTopicSchema), async (c) => {
        const topic = c.req.valid('json');

        const { id } = await createTopicHandler({
            createTopic: topic,
            userId: c.var.user.id,
        });

        return c.json({ id }, 201);
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
            const { id } = c.req.valid('param');
            const { topic } = await getTopicHandler({
                userId: c.var.user.id,
                id,
            });

            if (!topic) {
                return c.json({ message: 'Not Found' }, 404);
            }

            return c.json({ topic });
        },
    );

async function listTopicsHandler(c: Context<UserVar>) {
    assert(c.var.user.id, 'userId is required');

    const topics = await dbClient.query.topicsTable.findMany({
        limit: 20,
        where: eq(topicDbSchema.topicsTable.userId, c.var.user.id),
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
        topics,
    });
}

async function createTopicHandler(params: {
    createTopic: createTopicSchemaType;
    userId: string;
}) {
    const { createTopic, userId } = params;
    assert(userId, 'userId is required');
    assert(createTopic, 'createTopic is required');

    const id = prefixId('topic');

    const topicModel = topicMapper.mapToModel({
        id: id,
        userId,
        topic: createTopic,
    });

    await dbClient.transaction(async (trx) => {
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

    return {
        id,
    };
}

async function getTopicHandler(params: { id: string; userId: string }) {
    const { id, userId } = params;
    assert(id, 'id is required');
    assert(userId, 'userId is required');

    const topic = await dbClient.query.topicsTable.findFirst({
        where: and(
            eq(topicDbSchema.topicsTable.id, id),
            eq(topicDbSchema.topicsTable.userId, userId),
        ),
        with: {
            pullRequests: {
                columns: {
                    id: true,
                    url: true,
                    type: true,
                },
            },
            tasks: {
                columns: {
                    id: true,
                    url: true,
                    type: true,
                },
            },
        },
    });

    return {
        topic,
    };
}
