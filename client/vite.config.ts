import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import { nodeResolve } from '@rollup/plugin-node-resolve'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [TanStackRouterVite(), viteReact()],
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, './src'),
            src: path.resolve(import.meta.dirname, './src'),
            '@server': path.resolve(import.meta.dirname, '../server'),
        },
    },
    server: {
        port: 5173,
    },
    build: {
        rollupOptions: {
            plugins: [nodeResolve()],
            output: {
                manualChunks: {
                    '@tabler/icons-react': ['@tabler/icons-react'],
                    '@mantine/notifications': ['@mantine/notifications'],
                    '@project-planner/shared-schema': ['@project-planner/shared-schema'],
                    '@mantine/core': ['@mantine/core'],
                    '@mantine/modals': ['@mantine/modals'],
                    '@mantine/dates': ['@mantine/dates'],
                    '@clerk/clerk-react': ['@clerk/clerk-react'],
                    '@tanstack/react-query': ['@tanstack/react-query'],
                    zod: ['zod'],
                },
            },
        },
    },
})
