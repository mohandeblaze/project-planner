import {
    Button,
    Loader,
    PolymorphicComponentProps,
    Text,
    TextInput,
    TextInputProps,
    TextProps,
    ThemeIcon,
} from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import React, { forwardRef } from 'react'

export const TextElement = forwardRef(function TextElement(
    props: PolymorphicComponentProps<'div', TextProps>,
    ref: React.Ref<HTMLInputElement>,
) {
    return <Text component="div" {...props} ref={ref} />
})

export function TitleTextElement(props: {
    children?: React.ReactNode
    capitalize?: boolean
}) {
    return (
        <TextElement
            size="xl"
            fw={900}
            style={{
                textTransform: props.capitalize ? 'capitalize' : 'none',
            }}
        >
            {props.children}
        </TextElement>
    )
}

export function ErrorMessage(props: React.PropsWithChildren) {
    return (
        <Text c="red" size="xs">
            {props.children}
        </Text>
    )
}

export const Textbox = forwardRef(function Textbox(
    props: TextInputProps,
    ref: React.Ref<HTMLInputElement>,
) {
    return <TextInput ref={ref} {...props} className="flex flex-col gap-1" />
})

export const GradientTextElement = forwardRef(function GradientTextBox(
    props: PolymorphicComponentProps<'p', TextProps>,
    ref: React.Ref<HTMLInputElement>,
) {
    return (
        <Text
            {...props}
            ref={ref}
            variant="gradient"
            gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'indigo', deg: 90 }}
        />
    )
})

export function FullLoader() {
    return (
        <div className="w-full flex justify-center">
            <Loader type="dots" />
        </div>
    )
}

export function AddButton(props: { onClick: () => void }) {
    return (
        <div className="w-full flex justify-center">
            <Button
                onClick={props.onClick}
                leftSection={
                    <ThemeIcon variant="transparent" size={20}>
                        <IconPlus
                            className="flex justify-center w-full"
                            style={{ cursor: 'pointer' }}
                        />
                    </ThemeIcon>
                }
                variant="subtle"
                styles={{
                    section: {
                        marginInlineEnd: 6,
                        marginTop: 1,
                    },
                }}
            >
                Add
            </Button>
        </div>
    )
}
