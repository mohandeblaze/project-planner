import { caching } from 'cache-manager'

export interface IDataCache {
    cacheKey: string
    get<T>(userId: string): Promise<T | undefined>
    set<T>(userId: string, user: T): Promise<void>
    del(userId: string): Promise<void>
    reset(): Promise<void>
}

export const memoryCache = await caching('memory', {
    max: 1000,
    ttl: 0,
})
