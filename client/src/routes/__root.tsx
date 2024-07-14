import { useUser } from '@clerk/clerk-react'
import { AppShell, Box, Burger, Group, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
import AuthPrompt from 'src/components/authPrompt'
import { Sidebar } from 'src/layout/sidebar'

interface RouterContext {
    queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => <AppRoot />,
})

function AppRoot() {
    const [mobileOpened, { toggle: toggleSidebar }] = useDisclosure()
    const { isSignedIn } = useUser()

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'lg',
                collapsed: { mobile: !mobileOpened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Box className="flex items-center w-full">
                        <Box hiddenFrom="lg" className={'pr-4'}>
                            <Burger
                                opened={mobileOpened}
                                onClick={toggleSidebar}
                                hiddenFrom="lg"
                                size="sm"
                            />
                        </Box>
                        <Box className="flex items-center w-full justify-between">
                            <Link to="/">
                                <Title order={3}>Project Planner</Title>
                            </Link>
                            <Box className="flex items-center pr-4 cursor-pointer">
                                {isSignedIn ? <AuthPrompt /> : <></>}
                            </Box>
                        </Box>
                    </Box>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar bg={'transparent'}>
                <Sidebar toggleSidebar={toggleSidebar} />
            </AppShell.Navbar>
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    )
}
