import { createFileRoute } from '@tanstack/react-router';
import { useTopicList } from 'src/api/topicApi';

export const Route = createFileRoute('/')({
    component: Index,
});

function Index() {
    const { data, isLoading, error } = useTopicList();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>Topics</h1>
            <ul>{data?.topics.map((topic) => <li key={topic.id}>{topic.name}</li>)}</ul>
        </div>
    );
}
