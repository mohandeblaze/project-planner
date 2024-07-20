import { SignIn, SignOutButton, useUser } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import { Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { TextElement } from 'src/components/basic'

export default function AuthPrompt(props: {
    hideSignOut: boolean
    variant?: 'text' | 'button'
}) {
    const { isSignedIn } = useUser()
    const [opened, { open, close }] = useDisclosure(false)

    const element =
        props.variant === 'button' ? (
            <Button variant="outline" onClick={open}>
                Sign in
            </Button>
        ) : (
            <TextElement onClick={open}>Sign in</TextElement>
        )

    return (
        <>
            <Modal opened={opened} onClose={close} withCloseButton={false} radius={'lg'}>
                <SignIn
                    appearance={{
                        baseTheme: dark,
                    }}
                    forceRedirectUrl={window.location.href}
                />
            </Modal>
            {isSignedIn ? !props.hideSignOut && <SignOutButton /> : element}
        </>
    )
}
