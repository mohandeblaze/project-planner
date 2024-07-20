import { notifications } from '@mantine/notifications'
import {
    createTopicSchemaType,
    EditPullRequestsWithTypeSchemaType,
    EditTaskWithTypeSchemaType,
} from '@project-planner/shared-schema'
import { useMutation, useQuery } from '@tanstack/react-query'
import { atomWithQuery } from 'jotai-tanstack-query'
import {
    createTopicApi,
    getTopicApi,
    listTopicApi,
    updatePullRequests,
    updateTasks,
} from 'src/api/topicApi'
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
        create: mutation.mutateAsync,
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

export function useTopicByIdAtom({ id }: { id: string }) {
    return atomWithQuery(() => ({
        queryKey: ['topic', id],
    }))
}

export function useUpdateTasks(props: { topicId: string; onSuccess: () => void }) {
    const { topicId } = props
    const { token, isLoading } = useToken()

    const query = useMutation({
        mutationKey: ['useUpdateTasks', topicId],
        mutationFn: async (data: EditTaskWithTypeSchemaType) => {
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

export function useUpdatePullRequests(props: { topicId: string; onSuccess: () => void }) {
    const { topicId } = props
    const { token, isLoading } = useToken()

    const query = useMutation({
        mutationKey: ['useUpdatePullRequests', topicId],
        mutationFn: async (data: EditPullRequestsWithTypeSchemaType) => {
            return await updatePullRequests(token!, topicId, data)
        },
        onSuccess: () => {
            props.onSuccess()
            notifications.show({
                title: 'Pull requests updated',
                message: 'Pull requests were updated successfully',
                color: 'teal',
            })
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'There was an error while updating the pull requests',
                color: 'red',
            })
        },
    })

    return {
        data: query.data,
        isLoading: isLoading || query.isPending,
        error: query.error,
        updatePullRequestAsync: query.mutateAsync,
    }
}
