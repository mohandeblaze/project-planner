import { createFileRoute } from '@tanstack/react-router'
import { useTopicById } from 'src/hooks/useTopic'

export const Route = createFileRoute('/_authenticated/topics/$topicId')({
    component: ViewTopic,
})

function ViewTopic() {
    const { topicId } = Route.useParams()
    const { data, isLoading, error } = useTopicById({ id: topicId })

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    if (!data) {
        return <div>Please wait...</div>
    }

    return <div>Topic: {data.topic.name}</div>
}
