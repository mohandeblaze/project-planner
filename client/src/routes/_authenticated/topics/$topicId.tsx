import { GetTopicSchemaType } from '@/packages/schema/src/topic/getTopicSchema'
import { Divider, NavLink, Title } from '@mantine/core'
import { IconCode, IconGitPullRequest, IconLink, IconTestPipe } from '@tabler/icons-react'
import { createFileRoute } from '@tanstack/react-router'
import { TextElement } from 'src/components/basic'
import { useTopicById } from 'src/hooks/useTopic'
import { PullRequestBranches, TaskTypes } from 'src/types'
import { capitalize } from 'src/utils'

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

    return <ViewTopicBody topic={data.topic} />
}

function ViewTopicBody(props: { topic: GetTopicSchemaType }) {
    const topic = props.topic

    return (
        <div className="flex flex-col gap-4">
            <TextElement size="xl" fw={900}>
                {topic.name}
            </TextElement>
            <TaskList tasks={topic.tasks} />
            <Divider />
            <PullRequestList pullRequests={topic.pullRequests} />
        </div>
    )
}

function PullRequestList(props: { pullRequests: GetTopicSchemaType['pullRequests'] }) {
    return (
        <div>
            <Title c={'gray'} order={6}>
                Pull Requests
            </Title>
            <div className="flex flex-col gap-1 mt-2">
                {PullRequestBranches.map((branch) => {
                    const pullRequests = props.pullRequests.filter(
                        (pullRequest) => pullRequest.type === branch,
                    )
                    return (
                        <NavLink
                            key={branch + 'NavLink'}
                            href="#required-for-focus"
                            label={capitalize(branch == 'dev' ? 'Development' : branch)}
                            leftSection={<IconGitPullRequest size={18} />}
                        >
                            <div className="flex flex-col gap-1 mt-2">
                                {pullRequests.map((pullRequest) => (
                                    <NavLink
                                        key={pullRequest.id}
                                        href={pullRequest.url}
                                        target="_blank"
                                        label={pullRequest.url}
                                        leftSection={<IconLink size={18} />}
                                    />
                                ))}
                                {pullRequests.length === 0 && (
                                    <TextElement fs={'italic'} c={'gray'} size="xs">
                                        No pull requests
                                    </TextElement>
                                )}
                            </div>
                        </NavLink>
                    )
                })}
            </div>
        </div>
    )
}

function TaskList(props: { tasks: GetTopicSchemaType['tasks'] }) {
    return (
        <div>
            <Title c={'gray'} order={6}>
                Tasks
            </Title>
            <div className="flex flex-col gap-1 mt-2">
                {TaskTypes.map((taskType) => {
                    const tasks = props.tasks.filter((task) => task.type === taskType)
                    return (
                        <NavLink
                            key={taskType + 'NavLink'}
                            href="#required-for-focus"
                            label={capitalize(taskType)}
                            leftSection={
                                taskType === 'main' ? (
                                    <IconCode size={18} />
                                ) : (
                                    <IconTestPipe size={18} />
                                )
                            }
                        >
                            <div className="flex flex-col gap-1 mt-2">
                                {tasks.map((task) => (
                                    <NavLink
                                        key={task.id}
                                        href={task.url}
                                        target="_blank"
                                        label={task.url}
                                        leftSection={<IconLink size={18} />}
                                    />
                                ))}
                            </div>
                            {tasks.length === 0 && (
                                <TextElement fs={'italic'} c={'gray'} size="xs">
                                    No tasks
                                </TextElement>
                            )}
                        </NavLink>
                    )
                })}
            </div>
        </div>
    )
}