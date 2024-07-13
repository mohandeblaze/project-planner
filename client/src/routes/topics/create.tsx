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
import { FieldArrayPath, useFieldArray, useForm, UseFormReturn } from 'react-hook-form'
import { Fragment } from 'react/jsx-runtime'
import { ErrorMessage, Textbox } from 'src/components/basic'
import { useTopiCreate } from 'src/hooks/useTopic'
import { capitalize } from 'src/utils'

export const Route = createFileRoute('/topics/create')({
    component: () => <CreateTopic />,
})

function CreateTopic() {
    const { create, isLoading } = useTopiCreate()
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
                <Title order={3}>Create Topic</Title>
                <Space />

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
                    <Space />
                    <Task form={form} name="tasks" type="main" />
                    <Task form={form} name="tasks" type="test" />
                    <ErrorMessage>
                        {form.formState.errors.tasks?.root?.message}
                    </ErrorMessage>
                </div>

                <Divider />

                <div className="flex flex-col gap-2">
                    <Title order={4}>Pull Requests</Title>
                    <Space />

                    <PullRequest
                        key={'devPR'}
                        form={form}
                        name="pullRequests"
                        branch="dev"
                    />
                    <PullRequest
                        key={'masterPR'}
                        form={form}
                        name="pullRequests"
                        branch="master"
                    />
                    <PullRequest
                        key={'betaPR'}
                        form={form}
                        name="pullRequests"
                        branch="beta"
                    />
                    <ErrorMessage key={'prRootErrorMessage'}>
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

function PullRequest(props: {
    form: UseFormReturn<createTopicSchemaType>
    name: FieldArrayPath<Pick<createTopicSchemaType, 'pullRequests'>>
    branch: PullRequestType
}) {
    const form = props.form
    const branchType = props.branch
    const cBranch = capitalize(branchType)
    const { fields, append, remove } = useFieldArray({
        control: props.form.control,
        name: props.name,
    })

    return (
        <div className="flex flex-col gap-2">
            <Title order={6}>{cBranch}</Title>

            {fields
                .filter((x) => x.type == branchType)
                .map((field, index) => (
                    <Fragment key={field.id + 'prRoot'}>
                        <div key={field.id} className="flex items-center gap-1">
                            <Textbox
                                flex={1}
                                {...form.register(`${props.name}.${index}.url`)}
                                placeholder={`${cBranch} pull request`}
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
                ))}

            <IconPlus
                className="flex justify-center w-full"
                style={{ cursor: 'pointer' }}
                onClick={() => append({ url: '', type: branchType })}
            />
        </div>
    )
}

function Task(props: {
    form: UseFormReturn<createTopicSchemaType>
    name: FieldArrayPath<Pick<createTopicSchemaType, 'tasks'>>
    type: TaskType
}) {
    const form = props.form
    const taskType = props.type
    const cTask = capitalize(taskType)
    const { fields, append, remove } = useFieldArray({
        control: props.form.control,
        name: props.name,
    })

    return (
        <div className="flex flex-col gap-2">
            <Title order={6}>{cTask}</Title>

            {fields
                .filter((x) => x.type == taskType)
                .map((field, index) => {
                    return (
                        <Fragment key={field.id + 'taskRoot'}>
                            <div key={field.id} className="flex items-center gap-1">
                                <Textbox
                                    flex={1}
                                    {...form.register(`${props.name}.${index}.url`)}
                                    withAsterisk
                                    placeholder={`${cTask} task`}
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
                })}

            <IconPlus
                className="flex justify-center w-full"
                style={{ cursor: 'pointer' }}
                onClick={() => append({ url: '', type: taskType })}
            />
        </div>
    )
}
