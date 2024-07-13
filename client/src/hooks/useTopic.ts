import { notifications } from '@mantine/notifications'
import { createTopicSchemaType } from '@project-planner/shared-schema'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { topicCreate, topicList } from 'src/api/topicApi'
import { useToken } from 'src/hooks/useToken'

export function useTopicList({ page }: { page: number }) {
    const [fetched, setFetched] = useState(false)
    const { token, isLoading } = useToken()

    const query = useQuery({
        queryKey: ['topicList', page],
        queryFn: async () => {
            const list = await topicList(token!, page)
            setFetched(true)
            return list
        },
        enabled: !isLoading,
        placeholderData: (previousData) => previousData,
    })

    console.log(
        'Token:',
        isLoading,
        'Query:',
        query.isLoading,
        'Fetched:',
        fetched,
        'Data:',
        query.data,
    )

    return {
        data: query.data,
        isLoading: fetched ? false : isLoading || query.isLoading,
        error: query.error,
    }
}

export function useTopiCreate() {
    const { token, isLoading } = useToken()

    const mutation = useMutation({
        mutationFn: (data: createTopicSchemaType) => topicCreate(token!, data),
        mutationKey: ['topicCreate'],
        onSuccess: () => {
            notifications.show({
                title: 'Topic created',
                message: 'Topic was created successfully',
                color: 'teal',
            })
        },
        onError: (error) => {
            console.error('Error creating topic', error)
            notifications.show({
                title: 'Error',
                message: 'There was an error while creating the topic',
                color: 'red',
            })
        },
    })

    return {
        create: mutation.mutate,
        isLoading: isLoading || mutation.isPending,
    }
}
