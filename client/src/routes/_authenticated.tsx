import { useUser } from '@clerk/clerk-react'
import { Title } from '@mantine/core'
import { modals } from '@mantine/modals'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import AuthPrompt from 'src/components/authPrompt'

export const Route = createFileRoute('/_authenticated')({
    beforeLoad: () => {
        modals.closeAll()
    },
    component: ProtectedRoute,
})

function ProtectedRoute() {
    const { isSignedIn } = useUser()

    if (!isSignedIn) {
        return (
            <div className="flex flex-col gap-4 items-center justify-center min-h-full">
                <Title order={3}>Please sign in to continue</Title>
                <AuthPrompt variant="button" hideSignOut={true} />
            </div>
        )
    }

    return <Outlet />
}
