import { clerkMiddleware } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import {
    EditTaskWithTypeSchema,
    TopicDbSchema,
    type EditTaskWithTypeSchemaType,
    type EditPullRequestsWithTypeSchemaType,
    type UserRoleType,
    EditPullRequestsWithTypeSchema,
} from '@project-planner/shared-schema'
import { Hono } from 'hono'
import { z } from 'zod'
import { authMiddleware } from '../middleware/authMiddleware'
import { clerkUserMiddleware } from '../middleware/clerkUserMiddleware'
import { dbUserMiddleware } from '../middleware/dbUserMiddleware'
import { userEnabledMiddleware } from '../middleware/userEnabledMiddleware'
import { userRoleMiddleware, validRoles } from '../middleware/userRoleMiddleware'
import { dbClient } from '../db-client'
import { and, eq } from 'drizzle-orm'
import { isAdmin } from '../utils'
import { topicMapper } from '../mapper/topicMapper'
import { UTCDate } from '@date-fns/utc'

interface GeneralRouteData {
    userId: string
    userRole: UserRoleType
    topicId: string
}

const topicParamValidator = zValidator(
    'param',
    z.object({
        id: z.string(),
    }),
)

const editTaskBodyValidator = zValidator('json', EditTaskWithTypeSchema)
const editPrBodyValidator = zValidator('json', EditPullRequestsWithTypeSchema)

export const editTopicRoute = new Hono()
    .basePath('/:id')
    .use(clerkMiddleware())
    .use(authMiddleware())
    .use(dbUserMiddleware({ useCache: true }))
    .use(userEnabledMiddleware())
    .use(clerkUserMiddleware())
    .use(userRoleMiddleware(validRoles))
    .patch('/tasks', topicParamValidator, editTaskBodyValidator, async (c) => {
        const { id } = c.req.valid('param')
        const body = c.req.valid('json')

        const res = await updateTasks({
            json: body,
            topicId: id,
            userId: c.var.dbUser.id,
            userRole: c.var.dbUser.role,
        })

        return c.json(res.data, { status: res.status })
    })
    .patch('/pullRequests', topicParamValidator, editPrBodyValidator, async (c) => {
        const { id } = c.req.valid('param')
        const body = c.req.valid('json')

        const res = await updatePullRequests({
            json: body,
            topicId: id,
            userId: c.var.dbUser.id,
            userRole: c.var.dbUser.role,
        })

        return c.json(res.data, { status: res.status })
    })

async function updateTasks(
    data: GeneralRouteData & {
        json: EditTaskWithTypeSchemaType
    },
) {
    const { userId, topicId, json, userRole } = data
    const topic = await dbClient.query.topicsTable.findFirst({
        where: eq(TopicDbSchema.tasksTable.id, topicId),
        columns: {
            id: true,
            userId: true,
        },
    })

    if (!topic || (topic.userId !== userId && !isAdmin(userRole))) {
        return {
            status: 403,
            data: {
                message: 'Forbidden',
            },
        }
    }

    await dbClient.transaction(async (trx) => {
        const deleteQuery = and(
            eq(TopicDbSchema.tasksTable.topicId, topicId),
            eq(TopicDbSchema.tasksTable.type, json.type),
        )
        const p1 = trx.delete(TopicDbSchema.tasksTable).where(deleteQuery)

        const p2 = trx.insert(TopicDbSchema.tasksTable).values(
            topicMapper.mapToTasks({
                urls: json.tasks.map((task) => task.url),
                topicId,
                type: json.type,
            }),
        )

        const p3 = trx
            .update(TopicDbSchema.topicsTable)
            .set({
                updatedAt: new UTCDate(),
            })
            .where(eq(TopicDbSchema.topicsTable.id, topicId))

        await Promise.all([p1, p2, p3])
    })

    return {
        status: 200,
        data: {},
    }
}

async function updatePullRequests(
    data: GeneralRouteData & {
        json: EditPullRequestsWithTypeSchemaType
    },
) {
    const { userId, topicId, json, userRole } = data
    const topic = await dbClient.query.topicsTable.findFirst({
        where: eq(TopicDbSchema.tasksTable.id, topicId),
        columns: {
            id: true,
            userId: true,
        },
    })

    if (!topic || (topic.userId !== userId && !isAdmin(userRole))) {
        return {
            status: 403,
            data: {
                message: 'Forbidden',
            },
        }
    }

    await dbClient.transaction(async (trx) => {
        const deleteQuery = and(
            eq(TopicDbSchema.pullRequestsTable.topicId, topicId),
            eq(TopicDbSchema.pullRequestsTable.type, json.type),
        )
        const p1 = trx.delete(TopicDbSchema.pullRequestsTable).where(deleteQuery)

        const p2 = trx.insert(TopicDbSchema.pullRequestsTable).values(
            topicMapper.mapToPullRequests({
                urls: json.pullRequests.map((pr) => pr.url),
                topicId,
                type: json.type,
            }),
        )

        const p3 = trx
            .update(TopicDbSchema.topicsTable)
            .set({
                updatedAt: new UTCDate(),
            })
            .where(eq(TopicDbSchema.topicsTable.id, topicId))

        await Promise.all([p1, p2, p3])
    })

    return {
        status: 200,
        data: {},
    }
}
