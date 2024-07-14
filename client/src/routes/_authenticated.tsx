import { Title } from '@mantine/core'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useToken } from 'src/hooks/useToken'

export const Route = createFileRoute('/_authenticated')({
    component: ProtectedRoute,
})

function ProtectedRoute() {
    const { token } = useToken()
    if (!token) {
        return <Title>Sign in to view this page</Title>
    }

    return <Outlet />
}
