import type { ApiRoutes } from '@server/app'
import { hc } from 'hono/client'
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

    return new Error(`API Error: StatusCode=${res.status}, content=${content}`)
}
