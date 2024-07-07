import { type Topic } from '@/server/db/schema/topicSchema';
import {
    clerkUserMiddleware,
    type UserVar,
} from '@/server/middleware/clerkUserMiddleware';
import { topicCreateSchema } from '@/server/sharedTypes/topicType';
import { generateRandomId as randomId } from '@/server/utils';
import { UTCDate } from '@date-fns/utc';
import { zValidator } from '@hono/zod-validator';
import { Hono, type Context } from 'hono';
import { z } from 'zod';

const topicsDb: Topic[] = [];

async function listTopicsHandler(c: Context<UserVar>) {
    return c.json({
        topics: topicsDb,
    });
}

export const topicRoute = new Hono()
    .get('/', clerkUserMiddleware, listTopicsHandler)
    .post('/', clerkUserMiddleware, zValidator('json', topicCreateSchema), async (c) => {
        const topic = c.req.valid('json');

        const createTopic: Topic = {
            ...topic,
            id: randomId(),
            createdAt: new UTCDate(),
            updatedAt: new UTCDate(),
            pullRequests: topic.pullRequests.map((pr) => ({
                ...pr,
                id: randomId(),
                type: pr.type,
                url: pr.url,
                createdAt: new UTCDate(),
                updatedAt: new UTCDate(),
            })),
            tasks: topic.tasks.map((task) => ({
                ...task,
                id: randomId(),
                createdAt: new UTCDate(),
                updatedAt: new UTCDate(),
            })),
        };

        topicsDb.push(createTopic);

        return c.json({ id: createTopic.id }, 201);
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
            const topic = topicsDb.find((t) => t.id === c.req.param('id'));

            if (!topic) {
                return c.json({ message: 'Not Found' }, 404);
            }

            return c.json({ topic });
        },
    );
