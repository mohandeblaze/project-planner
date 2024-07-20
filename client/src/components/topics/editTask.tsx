import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group } from '@mantine/core'
import { modals } from '@mantine/modals'
import { TaskType } from '@project-planner/shared-schema'
import { IconEdit, IconPlus, IconX } from '@tabler/icons-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Fragment } from 'react/jsx-runtime'
import { ErrorMessage, Textbox } from 'src/components/basic'
import { capitalize } from 'src/utils'
import { z } from 'zod'

const EditTaskSchema = z.object({
    tasks: z.array(
        z.object({
            url: z.string().url(),
        }),
    ),
})

const MainEditTaskSchema = EditTaskSchema.extend({
    tasks: EditTaskSchema.shape.tasks.min(1, 'At least one main task is required'),
})

type EditTaskSchemaType = z.infer<typeof EditTaskSchema>

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

    function onSubmit(data: EditTaskSchemaType) {
        console.log(data)
        modals.close('edit-task')
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
                    <Button type="submit">Save</Button>
                </Group>
            </div>
        </form>
    )
}
