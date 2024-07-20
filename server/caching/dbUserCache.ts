import type { UsersSchemaType } from '@project-planner/shared-schema'
import { type MemoryCache } from 'cache-manager'
import { memoryCache, type IDataCache } from '.'
import { milliseconds } from 'date-fns'

type UserType = UsersSchemaType | undefined

export class DbUserCache implements IDataCache {
    public static readonly instance = new DbUserCache(memoryCache)

    private cache: MemoryCache
    // 3 minutes in milliseconds
    private ttl = milliseconds({ minutes: 10 })

    constructor(cache: MemoryCache) {
        this.cache = cache
    }

    async get<T = UserType>(userId: string) {
        const key = this.getUserCacheKey(userId)
        return await this.cache.get<T>(key)
    }

    async set<T = UserType>(userId: string, user: T) {
        const key = this.getUserCacheKey(userId)
        await this.cache.set(key, user, this.ttl)
    }

    async del(userId: string) {
        const key = this.getUserCacheKey(userId)
        await this.cache.del(key)
    }

    async reset() {
        await this.cache.reset()
    }

    private getUserCacheKey(userId: string) {
        return `user:${userId}`
    }
}
