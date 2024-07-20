import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group } from '@mantine/core'
import { modals } from '@mantine/modals'
import {
    EditTaskSchema,
    EditTaskSchemaType,
    MainEditTaskSchema,
    TaskType,
} from '@project-planner/shared-schema'
import { IconEdit, IconX } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { useFieldArray, useForm } from 'react-hook-form'
import { Fragment } from 'react/jsx-runtime'
import { AddButton, ErrorMessage, Textbox, TitleTextElement } from 'src/components/basic'
import { useUpdateTasks } from 'src/hooks/useTopic'
import { capitalize } from 'src/utils'

export default function EditTask(props: { type: TaskType; tasks: string[] }) {
    const { type } = props

    function openModal() {
        modals.open({
            modalId: 'edit-task',
            title: (
                <TitleTextElement
                    capitalize={true}
                >{`Edit task: ${type}`}</TitleTextElement>
            ),
            children: <EditTaskForm type={type} tasks={props.tasks} />,
            closeOnClickOutside: false,
            lockScroll: false,
        })
    }

    return <IconEdit onClick={openModal} size={18} />
}

function EditTaskForm(props: { type: TaskType; tasks: string[] }) {
    const { topicId } = useParams({ strict: false })
    const qc = useQueryClient()

    const form = useForm<EditTaskSchemaType>({
        defaultValues: {
            tasks: props.tasks.map((url) => ({ url })),
        },
        resolver: zodResolver(props.type == 'main' ? MainEditTaskSchema : EditTaskSchema),
        mode: 'onSubmit',
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'tasks',
    })

    const { isLoading, updateTasksAsync } = useUpdateTasks({
        topicId: topicId!,
        onSuccess: () => {
            modals.close('edit-task')
        },
    })

    async function onSubmit(data: EditTaskSchemaType) {
        await updateTasksAsync({
            type: props.type,
            tasks: data.tasks.map((task) => ({ url: task.url })),
        })
        qc.invalidateQueries({
            queryKey: ['topic', topicId!],
        })
    }

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit, console.error)}
            className="flex flex-col gap-2"
        >
            {fields.map((field, index) => (
                <Fragment key={field.id + 'TaskRoot'}>
                    <div key={field.id + 'Field'} className="flex items-center gap-1">
                        <Textbox
                            flex={1}
                            {...form.register(`tasks.${index}.url`)}
                            withAsterisk
                            placeholder={capitalize(`${props.type} task URL`)}
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
            ))}

            <AddButton onClick={() => append({ url: '' })} />

            <ErrorMessage>{form.formState.errors.tasks?.root?.message}</ErrorMessage>

            <div>
                <Group justify="flex-end" mt="md">
                    <Button loading={isLoading} type="submit">
                        Save
                    </Button>
                </Group>
            </div>
        </form>
    )
}
