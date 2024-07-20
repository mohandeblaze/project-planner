import { notifications } from '@mantine/notifications'
import {
    createTopicSchemaType,
    EditTaskSchemaWithTaskTypeType,
} from '@project-planner/shared-schema'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createTopicApi, getTopicApi, listTopicApi, updateTasks } from 'src/api/topicApi'
import { useToken } from 'src/hooks/useToken'

export function useListTopic({ page }: { page: number }) {
    const { token, isLoading } = useToken()

    const query = useQuery({
        queryKey: ['topicList', page],
        queryFn: async () => {
            return await listTopicApi(token!, page)
        },
        enabled: !isLoading,
        placeholderData: (previousData) => previousData,
    })

    return {
        data: query.data,
        isLoading: isLoading || query.isLoading,
        error: query.error,
    }
}

export function useCreateTopic() {
    const { token, isLoading } = useToken()

    const mutation = useMutation({
        mutationFn: (data: createTopicSchemaType) => createTopicApi(token!, data),
        mutationKey: ['topicCreate'],
        onSuccess: () => {
            notifications.show({
                title: 'Topic created',
                message: 'Topic was created successfully',
                color: 'teal',
            })
        },
        onError: () => {
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

export function useTopicById({ id }: { id: string }) {
    const { token, isLoading } = useToken()

    const query = useQuery({
        queryKey: ['topic', id],
        queryFn: async () => {
            return await getTopicApi(token!, id)
        },
        enabled: !isLoading,
        placeholderData: (previousData) => previousData,
    })

    return {
        data: query.data,
        isLoading: isLoading || query.isLoading,
        error: query.error,
    }
}

export function useUpdateTasks(props: { topicId: string; onSuccess: () => void }) {
    const { topicId } = props
    const { token, isLoading } = useToken()

    const query = useMutation({
        mutationKey: ['useUpdateTasks', topicId],
        mutationFn: async (data: EditTaskSchemaWithTaskTypeType) => {
            return await updateTasks(token!, topicId, data)
        },
        onSuccess: () => {
            props.onSuccess()
            notifications.show({
                title: 'Tasks updated',
                message: 'Tasks were updated successfully',
                color: 'teal',
            })
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'There was an error while updating the tasks',
                color: 'red',
            })
        },
    })

    return {
        data: query.data,
        isLoading: isLoading || query.isPending,
        error: query.error,
        updateTasksAsync: query.mutateAsync,
    }
}
