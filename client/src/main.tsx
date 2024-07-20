import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import {
    MutationCache,
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { routeTree } from 'src/routeTree.gen'
import './index.scss'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
            refetchIntervalInBackground: false,
        },
    },
    queryCache: new QueryCache({
        onError: (error) => {
            console.error('Query failed', error)
        },
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            console.error('Mutation failed', error)
        },
    }),
})

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </React.StrictMode>,
    )
}
