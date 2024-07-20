import { ClerkProvider, useUser } from '@clerk/clerk-react'
import {
    AppShell,
    Box,
    Burger,
    createTheme,
    Group,
    MantineColorsTuple,
    MantineProvider,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
import { ClientEnv } from 'src/clientEnv'
import AuthPrompt from 'src/components/authPrompt'
import { GradientTextElement } from 'src/components/basic'
import { Sidebar } from 'src/layout/sidebar'

// Import your publishable key
const PUBLISHABLE_KEY = ClientEnv.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}

// base color #3b5bdb
const colorPalette: MantineColorsTuple = [
    '#eaf1ff',
    '#d5ddfd',
    '#aab9f3',
    '#7b92e8',
    '#5571e0',
    '#3c5cdb',
    '#2d51da',
    '#1f43c2',
    '#163bae',
    '#06329a',
]

const theme = createTheme({
    primaryColor: 'custom',
    colors: {
        custom: colorPalette,
    },
    autoContrast: true,
})

interface RouterContext {
    queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => {
        return (
            <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
                <MantineProvider forceColorScheme="dark" theme={theme}>
                    <Notifications position={'top-right'} />
                    <ModalsProvider>
                        <AppRoot />
                    </ModalsProvider>
                </MantineProvider>
            </ClerkProvider>
        )
    },
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
                                {isSignedIn ? <AuthPrompt hideSignOut={true} /> : <></>}
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
