import { ListTopicSchemaType } from '@/packages/schema'
import { Card, Pagination, SimpleGrid, Title, Tooltip } from '@mantine/core'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { TextElement } from 'src/components/basic'
import { useListTopic } from 'src/hooks/useTopic'

export const Route = createFileRoute('/_authenticated/')({
    component: Index,
})

function Index() {
    const [page, setPage] = useState(1)
    const { data, isLoading, error } = useListTopic({
        page,
    })

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    if (!data) {
        return <div>Please wait...</div>
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <Title order={3}>Topics</Title>
            <SimpleGrid
                cols={{ base: 1, xs: 1, sm: 2, lg: 3 }}
                spacing={{ base: 'sm' }}
                verticalSpacing={{ base: 'sm' }}
            >
                {data.topics.map((topic) => (
                    <TopicCard key={topic.id + 'TopicListItem'} topic={topic} />
                ))}
            </SimpleGrid>
            <div className="flex justify-center w-full mt-5">
                <Pagination
                    className="max-w-3xl flex justify-center"
                    value={page}
                    onChange={setPage}
                    total={data?.totalPage ?? 0}
                />
            </div>
        </div>
    )
}

function TopicCard(props: { topic: ListTopicSchemaType }) {
    const topic = props.topic

    return (
        <Link to={'/topics/$topicId'} params={{ topicId: topic.id }}>
            <Card
                shadow="sm"
                padding="sm"
                radius="md"
                withBorder
                style={{
                    cursor: 'pointer',
                }}
            >
                <Tooltip label={topic.name} openDelay={500}>
                    <TextElement size="lg" truncate={'end'} style={{ fontWeight: 700 }}>
                        {topic.name}
                    </TextElement>
                </Tooltip>
            </Card>
        </Link>
    )
}
