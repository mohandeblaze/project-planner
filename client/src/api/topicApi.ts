import { createTopicSchemaType } from '@project-planner/shared-schema'
import { api, getheaders } from '.'

export async function topicList(token: string) {
    const res = await api.topics.$get({}, getheaders(token))

    if (!res.ok) {
        throw new Error(res.statusText)
    }

    return res.json()
}

export async function topicCreate(token: string, data: createTopicSchemaType) {
    const res = await api.topics.$post(
        {
            json: data,
        },
        getheaders(token),
    )

    if (!res.ok) {
        throw new Error(res.statusText)
    }

    return res.json()
}
