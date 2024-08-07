import {
    createTopicSchemaType,
    EditPullRequestsWithTypeSchemaType,
    EditTaskWithTypeSchemaType,
} from '@project-planner/shared-schema'
import { api, getheaders, handleApiError } from '.'

export async function listTopicApi(token: string, page: number) {
    const res = await api.topics.$get(
        {
            query: {
                page: page.toString(),
            },
        },
        getheaders(token),
    )

    if (!res.ok) {
        throw handleApiError(res)
    }

    return res.json()
}

export async function createTopicApi(token: string, data: createTopicSchemaType) {
    const res = await api.topics.$post(
        {
            json: data,
        },
        getheaders(token),
    )

    if (!res.ok) {
        throw handleApiError(res)
    }

    return res.json()
}

export async function getTopicApi(token: string, id: string) {
    const res = await api.topics[':id'].$get(
        {
            param: {
                id,
            },
        },
        getheaders(token),
    )

    if (!res.ok) {
        throw handleApiError(res)
    }

    return res.json()
}

export async function updateTasks(
    token: string,
    topicId: string,
    json: EditTaskWithTypeSchemaType,
) {
    const res = await api.topic.edit[':id'].tasks.$patch(
        {
            param: {
                id: topicId,
            },
            json,
        },
        getheaders(token),
    )

    if (!res.ok) {
        throw handleApiError(res)
    }

    return res.json()
}

export function updatePullRequests(
    token: string,
    topicId: string,
    json: EditPullRequestsWithTypeSchemaType,
) {
    return api.topic.edit[':id'].pullRequests.$patch(
        {
            param: {
                id: topicId,
            },
            json,
        },
        getheaders(token),
    )
}
