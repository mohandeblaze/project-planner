import { Button, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { createTopicSchema, createTopicSchemaType } from '@project-planner/shared-schema';
import { createFileRoute } from '@tanstack/react-router';
import { zodResolver } from 'mantine-form-zod-resolver';

export const Route = createFileRoute('/topics/create')({
    component: () => <CreateTopic />,
});

function CreateTopic() {
    const form = useForm<createTopicSchemaType>({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            pullRequests: [],
            tasks: [],
        },
        validate: zodResolver(createTopicSchema),
    });

    return (
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <TextInput
                withAsterisk
                label="Name"
                placeholder="your@email.com"
                key={form.key('name')}
                {...form.getInputProps('name')}
            />

            <Group justify="flex-end" mt="md">
                <Button type="submit">Submit</Button>
            </Group>
        </form>
    );
}
