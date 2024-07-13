import React, { forwardRef } from 'react'
import { Text, TextInput, TextInputProps } from '@mantine/core'

export const TextElement = Text

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
