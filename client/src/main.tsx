import { ClerkProvider } from '@clerk/clerk-react'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClientEnv } from 'src/clientEnv'
import { routeTree } from 'src/routeTree.gen'
import './index.css'
import '@mantine/notifications/styles.css'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
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

const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
                    <MantineProvider defaultColorScheme="dark">
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
