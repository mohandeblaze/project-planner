import { useAuth } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'

export function useToken() {
    const auth = useAuth()

    const query = useQuery({
        queryKey: ['useToken'],
        queryFn: () =>
            auth.getToken({
                template: 'basic',
            }),
        staleTime: 1000 * 55 * 60, // 55 minutes
    })

    return {
        token: query.data,
        isLoading: query.isLoading || query.isFetching || query.isRefetching,
        error: query.error,
    }
}
