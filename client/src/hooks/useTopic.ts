import { useMutation, useQuery } from '@tanstack/react-query'
import { topicCreate, topicList } from 'src/api/topicApi'
import { useToken } from 'src/hooks/useToken'
import { createTopicSchemaType } from '@project-planner/shared-schema'
import { notifications } from '@mantine/notifications'

export function useTopicList() {
    const { token, isLoading } = useToken()
    return useQuery({
        queryKey: ['topicList'],
        queryFn: () => topicList(token!),
        enabled: !isLoading,
    })
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
