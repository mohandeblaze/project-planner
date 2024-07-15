import { useUser } from '@clerk/clerk-react'
import { AppShell, Box, Burger, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
import AuthPrompt from 'src/components/authPrompt'
import { GradientTextElement } from 'src/components/basic'
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
    const width = 250

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width,
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
                                <GradientTextElement size="xl" fw={900}>
                                    Project Planner
                                </GradientTextElement>
                            </Link>
                            <Box className="flex items-center pr-4 cursor-pointer">
                                {isSignedIn ? <AuthPrompt /> : <></>}
                            </Box>
                        </Box>
                    </Box>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar bg={'transparent'}>
                <Sidebar width={width} toggleSidebar={toggleSidebar} />
            </AppShell.Navbar>
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    )
}
