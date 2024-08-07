import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group, UnstyledButton } from '@mantine/core'
import { modals } from '@mantine/modals'
import {
    EditPullRequestsSchema,
    EditPullRequestsSchemaType,
    PullRequestType,
} from '@project-planner/shared-schema'
import { IconEdit, IconX } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { useFieldArray, useForm } from 'react-hook-form'
import { Fragment } from 'react/jsx-runtime'
import { AddButton, ErrorMessage, Textbox, TitleTextElement } from 'src/components/basic'
import { useUpdatePullRequests } from 'src/hooks/useTopic'
import { capitalize } from 'src/utils'

export default function EditPullRequest(props: { type: PullRequestType; pr: string[] }) {
    const { type } = props

    function openModal() {
        modals.open({
            modalId: 'edit-pr',
            title: (
                <TitleTextElement
                    capitalize={true}
                >{`Edit PR: ${type}`}</TitleTextElement>
            ),
            children: <EditPullRequestForm type={type} pr={props.pr} />,
            closeOnClickOutside: false,
            lockScroll: false,
        })
    }

    return (
        <UnstyledButton onClick={openModal}>
            <IconEdit size={18} />
        </UnstyledButton>
    )
}

function EditPullRequestForm(props: { type: PullRequestType; pr: string[] }) {
    const { topicId } = useParams({ strict: false })
    const qc = useQueryClient()

    const form = useForm<EditPullRequestsSchemaType>({
        defaultValues: {
            pullRequests: props.pr.map((url) => ({ url })),
        },
        resolver: zodResolver(EditPullRequestsSchema),
        mode: 'onSubmit',
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'pullRequests',
    })

    const { isLoading, updatePullRequestAsync } = useUpdatePullRequests({
        topicId: topicId!,
        onSuccess: () => {
            modals.close('edit-pr')
        },
    })

    async function onSubmit(data: EditPullRequestsSchemaType) {
        await updatePullRequestAsync({
            type: props.type,
            pullRequests: data.pullRequests.map((pr) => ({ url: pr.url })),
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
                <Fragment key={field.id + 'PullRequestRoot'}>
                    <div
                        key={field.id + 'PullRequestField'}
                        className="flex items-center gap-1"
                    >
                        <Textbox
                            flex={1}
                            {...form.register(`pullRequests.${index}.url`)}
                            withAsterisk
                            placeholder={capitalize(`${props.type} PR URL`)}
                            rightSection={
                                <UnstyledButton onClick={() => remove(index)}>
                                    <IconX />
                                </UnstyledButton>
                            }
                        />
                    </div>
                    <ErrorMessage key={`${field.id}errorMessage`}>
                        {form.formState.errors.pullRequests?.[index]?.url?.message}
                    </ErrorMessage>
                </Fragment>
            ))}

            <AddButton onClick={() => append({ url: '' })} />

            <ErrorMessage>
                {form.formState.errors.pullRequests?.root?.message}
            </ErrorMessage>

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
