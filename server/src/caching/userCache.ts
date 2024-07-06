import { User } from "@clerk/backend";
import { caching } from "cache-manager";

type UserType = User | undefined;

const memoryCache = await caching("memory", {
    max: 100,
    // 3 minutes in milliseconds
    ttl: 180 * 1000,
});

function getUserCacheKey(userId: string) {
    return `user:${userId}`;
}

export async function getUserCache(userId: string) {
    const key = getUserCacheKey(userId);
    const user = await memoryCache.get<UserType>(key);
    return user;
}

export async function setUserCache(userId: string, user: UserType) {
    const key = getUserCacheKey(userId);
    await memoryCache.set(key, user);
}

export async function deleteUserCache(userId: string) {
    const key = getUserCacheKey(userId);
    await memoryCache.del(key);
}

export async function clearUserCache() {
    await memoryCache.reset();
}
