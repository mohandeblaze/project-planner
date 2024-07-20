import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group } from '@mantine/core'
import { modals } from '@mantine/modals'
import {
    EditTaskSchema,
    EditTaskSchemaType,
    MainEditTaskSchema,
    TaskType,
} from '@project-planner/shared-schema'
import { IconEdit, IconPlus, IconX } from '@tabler/icons-react'
import { useParams } from '@tanstack/react-router'
import { useFieldArray, useForm } from 'react-hook-form'
import { Fragment } from 'react/jsx-runtime'
import { ErrorMessage, Textbox } from 'src/components/basic'
import { useUpdateTasks } from 'src/hooks/useTopic'
import { capitalize } from 'src/utils'

export default function EditTask(props: { type: TaskType; tasks: string[] }) {
    const { type } = props

    function openModal() {
        modals.open({
            modalId: 'edit-task',
            title: `Edit ${type} tasks`,
            children: <EditTaskForm type={type} tasks={props.tasks} />,
            closeOnClickOutside: false,
            lockScroll: false,
        })
    }

    return <IconEdit onClick={openModal} size={18} />
}

function EditTaskForm(props: { type: TaskType; tasks: string[] }) {
    const { topicId } = useParams({ strict: false })

    const form = useForm<EditTaskSchemaType>({
        defaultValues: {
            tasks: props.tasks.map((task) => ({ url: task })),
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

            <IconPlus
                className="flex justify-center w-full"
                style={{ cursor: 'pointer' }}
                onClick={() => append({ url: '' })}
            />

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
