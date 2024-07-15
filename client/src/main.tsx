import { ClerkProvider } from '@clerk/clerk-react'
import { createTheme, MantineColorsTuple, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import '@mantine/notifications/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClientEnv } from 'src/clientEnv'
import { routeTree } from 'src/routeTree.gen'
import './index.css'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
            refetchIntervalInBackground: false,
        },
    },
})

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

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

const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
                    <MantineProvider forceColorScheme="dark" theme={theme}>
                        <Notifications />
                        <ModalsProvider>
                            <RouterProvider router={router} />
                        </ModalsProvider>
                    </MantineProvider>
                </ClerkProvider>
            </QueryClientProvider>
        </React.StrictMode>,
    )
}
