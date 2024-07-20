import { hc } from 'hono/client'
import type { ApiRoutes } from '@server/app'
import { ClientEnv } from 'src/clientEnv'

const baseUrl = ClientEnv.VITE_API_URL

const client = hc<ApiRoutes>(baseUrl, {})

export const api = client.api

export function getheaders(token: string) {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
}

export async function handleApiError(res: Response) {
    const content = await res.text()

    throw new Error(`API Error: ${res.status} ${res.statusText} ${content}`)
}
