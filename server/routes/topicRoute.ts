import { clerkUserMiddleware } from '@/server/middleware/clerkUserMiddleware'
import { prefixId } from '@/server/utils'
import { clerkMiddleware } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import {
    createTopicSchema,
    GetTopicSchema,
    ListTopicSchema,
    TopicDbSchema,
    type createTopicSchemaType,
} from '@project-planner/shared-schema'
import assert from 'assert'
import { and, count, desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import { dbClient } from '../db-client'
import { topicMapper } from '../mapper/topicMapper'
import { authMiddleware } from '../middleware/authMiddleware'
import { dbUserMiddleware } from '../middleware/dbUserMiddleware'
import { userEnabledMiddleware } from '../middleware/userEnabledMiddleware'
import { userRoleMiddleware, validRoles } from '../middleware/userRoleMiddleware'

export const topicRoute = new Hono()
    .use(clerkMiddleware())
    .use(authMiddleware())
    .use(dbUserMiddleware({ useCache: true }))
    .use(userEnabledMiddleware())
    .use(clerkUserMiddleware())
    .use(userRoleMiddleware(validRoles))
    .get(
        '/',
        zValidator(
            'query',
            z.object({
                page: z.coerce.number().optional(),
            }),
        ),
        async (c) => {
            const q = c.req.valid('query')
            q.page = q.page || 1

            const list = await listTopicsHandler(c.var.user.id, q.page)

            return c.json({ ...list })
        },
    )
    .post('/', zValidator('json', createTopicSchema), async (c) => {
        const topic = c.req.valid('json')

        const { id } = await createTopicHandler({
            createTopic: topic,
            userId: c.var.user.id,
        })

        return c.json({ id }, 201)
    })
    .get(
        '/:id',
        zValidator(
            'param',
            z.object({
                id: z.string(),
            }),
        ),
        async (c) => {
            const { id } = c.req.valid('param')
            const { topic } = await getTopicHandler({
                userId: c.var.user.id,
                id,
            })

            if (!topic) {
                return c.json({ message: 'Not Found' }, 404)
            }

            return c.json({ topic })
        },
    )

async function listTopicsHandler(userId: string, page: number) {
    assert(userId, 'userId is required')

    const limit = 10
    const whereQuery = eq(TopicDbSchema.topicsTable.userId, userId)
    const skip = (page - 1) * limit

    const totalCount = await dbClient
        .select({
            count: count(),
        })
        .from(TopicDbSchema.topicsTable)
        .where(whereQuery)
        .then((x) => x[0].count)

    const topics = await dbClient.query.topicsTable.findMany({
        limit: limit,
        where: whereQuery,
        orderBy: desc(TopicDbSchema.topicsTable.createdAt),
        offset: skip,
        columns: {
            id: true,
            name: true,
            createdAt: true,
        },
    })

    const items = topics.map((x) => ListTopicSchema.parse(x))

    return {
        topics: items,
        count: totalCount,
        totalPage: Math.ceil(totalCount / limit),
    }
}

async function createTopicHandler(params: {
    createTopic: createTopicSchemaType
    userId: string
}) {
    const { createTopic, userId } = params
    assert(userId, 'userId is required')
    assert(createTopic, 'createTopic is required')

    const id = prefixId('topic')

    const topicModel = topicMapper.mapToModel({
        id: id,
        userId,
        topic: createTopic,
    })

    await dbClient.transaction(async (trx) => {
        await trx.insert(TopicDbSchema.topicsTable).values(topicModel)

        if (topicModel.pullRequests.length > 0) {
            await trx
                .insert(TopicDbSchema.pullRequestsTable)
                .values(topicModel.pullRequests)
        }

        if (topicModel.tasks.length > 0) {
            await trx.insert(TopicDbSchema.tasksTable).values(topicModel.tasks)
        }
    })

    return {
        id,
    }
}

async function getTopicHandler(params: { id: string; userId: string }) {
    const { id, userId } = params
    assert(id, 'id is required')
    assert(userId, 'userId is required')

    const topicResult = await dbClient.query.topicsTable.findFirst({
        where: and(
            eq(TopicDbSchema.topicsTable.id, id),
            eq(TopicDbSchema.topicsTable.userId, userId),
        ),
        columns: {
            id: true,
            name: true,
        },
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
    })

    const topic = GetTopicSchema.parse(topicResult)

    return {
        topic,
    }
}
