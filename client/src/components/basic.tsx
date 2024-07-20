import {
    Loader,
    PolymorphicComponentProps,
    Text,
    TextInput,
    TextInputProps,
    TextProps,
} from '@mantine/core'
import React, { forwardRef } from 'react'

export const TextElement = forwardRef(function TextElement(
    props: PolymorphicComponentProps<'div', TextProps>,
    ref: React.Ref<HTMLInputElement>,
) {
    return <Text component="div" {...props} ref={ref} />
})

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
