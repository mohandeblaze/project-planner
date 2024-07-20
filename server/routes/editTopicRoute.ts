import { clerkMiddleware } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import {
    EditTaskSchemaWithTaskType,
    TopicDbSchema,
    type EditTaskSchemaWithTaskTypeType,
    type UserRoleType,
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

const editTaskBodyValidator = zValidator('json', EditTaskSchemaWithTaskType)

export const editTopicRoute = new Hono()
    .basePath('/:id')
    .use(clerkMiddleware())
    .use(authMiddleware())
    .use(dbUserMiddleware({ useCache: true }))
    .use(userEnabledMiddleware())
    .use(clerkUserMiddleware())
    .use(userRoleMiddleware(validRoles))
    .patch('/testTasks', topicParamValidator, editTaskBodyValidator, async (c) => {
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

async function updateTasks(
    data: GeneralRouteData & {
        json: EditTaskSchemaWithTaskTypeType
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
        await trx.delete(TopicDbSchema.tasksTable).where(deleteQuery)

        await trx.insert(TopicDbSchema.tasksTable).values(
            topicMapper.mapToTasks({
                urls: json.tasks.map((task) => task.url),
                topicId,
                type: json.type,
            }),
        )

        await trx
            .update(TopicDbSchema.topicsTable)
            .set({
                updatedAt: new UTCDate(),
            })
            .where(eq(TopicDbSchema.topicsTable.id, topicId))
    })

    return {
        status: 200,
        data: {},
    }
}
