import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Divider, Group, Space, Title } from '@mantine/core'
import {
    createTopicSchema,
    createTopicSchemaType,
    PullRequestType,
    TaskType,
} from '@project-planner/shared-schema'
import { IconPlus, IconX } from '@tabler/icons-react'
import { createFileRoute } from '@tanstack/react-router'
import { FieldArrayWithId, useFieldArray, useForm, UseFormReturn } from 'react-hook-form'
import { Fragment } from 'react/jsx-runtime'
import { ErrorMessage, Textbox, TextElement } from 'src/components/basic'
import { useCreateTopic } from 'src/hooks/useTopic'
import { PullRequestBranches, TaskTypes } from 'src/types'
import { capitalize } from 'src/utils'

export const Route = createFileRoute('/_authenticated/topics/create')({
    component: () => <CreateTopic />,
})

function CreateTopic() {
    const { create, isLoading } = useCreateTopic()
    const form = useForm<createTopicSchemaType>({
        defaultValues: {
            name: '',
            pullRequests: [],
            tasks: [
                {
                    url: '',
                    type: 'main',
                },
            ],
        },
        resolver: zodResolver(createTopicSchema),
        mode: 'onSubmit',
    })

    function onSubmit(data: createTopicSchemaType) {
        create(data)
    }

    return (
        <div className="flex flex-col items-center w-full">
            <form
                className="flex flex-col gap-4 w-full max-w-screen-md"
                onSubmit={form.handleSubmit(onSubmit, console.error)}
            >
                <TextElement size="xl" fw={900}>
                    Create Topic
                </TextElement>
                <div className="flex flex-col gap-2">
                    <Textbox
                        {...form.register('name')}
                        withAsterisk
                        label="Name"
                        placeholder="Topic name"
                    />
                    <ErrorMessage>{form.formState.errors.name?.message}</ErrorMessage>
                </div>

                <Divider />

                <div className="flex flex-col gap-2">
                    <Title order={4}>Tasks</Title>
                    {/* Description */}
                    <TextElement size="xs">
                        Add at least one task either in development or testing
                    </TextElement>
                    <Space />
                    <Task form={form} />
                    <ErrorMessage>
                        {form.formState.errors.tasks?.root?.message}
                    </ErrorMessage>
                </div>

                <Divider />

                <div className="flex flex-col gap-2">
                    <Title order={4}>Pull Requests</Title>
                    {/* Description */}
                    <TextElement size="xs">
                        Add the pull requests for the different branches
                    </TextElement>
                    <Space />

                    <PullRequest form={form} />
                    <ErrorMessage key={'PrRootErrorMessage'}>
                        {form.formState.errors.pullRequests?.root?.message}
                    </ErrorMessage>
                </div>

                <Divider />

                <div>
                    <Group justify="flex-end" mt="md">
                        <Button loading={isLoading} type="submit">
                            Submit
                        </Button>
                    </Group>
                </div>
            </form>
        </div>
    )
}

function PullRequest(props: { form: UseFormReturn<createTopicSchemaType> }) {
    const form = props.form
    const { fields, append, remove } = useFieldArray({
        control: props.form.control,
        name: 'pullRequests',
    })

    const pullRequest = fields.map((field, index) => {
        return {
            index,
            field,
        }
    })

    function PullRequestBody(props: {
        field: FieldArrayWithId<createTopicSchemaType['pullRequests']>
        index: number
        branch: PullRequestType
    }) {
        const { field, index } = props

        return (
            <Fragment key={field.id + 'PrRoot'}>
                <div key={field.id} className="flex items-center gap-1">
                    <Textbox
                        flex={1}
                        {...form.register(`pullRequests.${index}.url`)}
                        placeholder={capitalize(`${props.branch} pull request`)}
                        rightSection={
                            <IconX
                                style={{ cursor: 'pointer' }}
                                onClick={() => remove(index)}
                            />
                        }
                    />
                </div>
                <ErrorMessage key={`${field.id}errorMessage`}>
                    {form.formState.errors.pullRequests?.[index]?.url?.message}
                </ErrorMessage>
            </Fragment>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            {PullRequestBranches.map((branch) => {
                const prs = pullRequest.filter((x) => x.field.type == branch)

                return (
                    <Fragment key={branch + 'Branch'}>
                        <Title order={6}>
                            {capitalize(branch == 'dev' ? 'Development' : branch)}
                        </Title>
                        <Space />

                        {prs.map((pr) => {
                            return (
                                <PullRequestBody
                                    key={`${pr.field.id}${branch}PRBody`}
                                    field={pr.field}
                                    index={pr.index}
                                    branch={branch}
                                />
                            )
                        })}

                        <IconPlus
                            className="flex justify-center w-full"
                            style={{ cursor: 'pointer' }}
                            onClick={() => append({ url: '', type: branch })}
                        />
                    </Fragment>
                )
            })}
        </div>
    )
}

function Task(props: { form: UseFormReturn<createTopicSchemaType> }) {
    const form = props.form
    const { fields, append, remove } = useFieldArray({
        control: props.form.control,
        name: 'tasks',
    })

    const tasks = fields.map((field, index) => {
        return {
            index,
            field,
        }
    })

    function TaskBody(props: {
        field: FieldArrayWithId<createTopicSchemaType['tasks']>
        index: number
        type: TaskType
    }) {
        const { field, index } = props

        return (
            <Fragment key={field.id + 'TaskRoot'}>
                <div key={field.id + 'Field'} className="flex items-center gap-1">
                    <Textbox
                        flex={1}
                        {...form.register(`tasks.${index}.url`)}
                        withAsterisk
                        placeholder={capitalize(`${props.type} task`)}
                        rightSection={
                            <IconX
                                style={{ cursor: 'pointer' }}
                                onClick={() => remove(index)}
                            />
                        }
                    />
                </div>
                <ErrorMessage key={`${field.id}errorMessage`}>
                    {form.formState.errors.tasks?.[index]?.url?.message}
                </ErrorMessage>
            </Fragment>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            {TaskTypes.map((taskType) => {
                const filteredTasks = tasks.filter((x) => x.field.type == taskType)
                return (
                    <Fragment key={taskType + 'TaskType'}>
                        <Title order={6}>
                            {capitalize(taskType == 'main' ? 'Development' : taskType)}
                        </Title>
                        {filteredTasks.map((task) => {
                            return (
                                <TaskBody
                                    key={`${task.field.id}${taskType}TaskBody`}
                                    field={task.field}
                                    index={task.index}
                                    type={taskType}
                                />
                            )
                        })}

                        <IconPlus
                            className="flex justify-center w-full"
                            style={{ cursor: 'pointer' }}
                            onClick={() => append({ url: '', type: taskType })}
                        />
                    </Fragment>
                )
            })}
        </div>
    )
}
