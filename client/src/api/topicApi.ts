import { useQuery } from '@tanstack/react-query';
import { api, getheaders } from '.';
import { useToken } from 'src/hooks/useToken';

async function topicList(token: string) {
    const res = await api.topics.$get({}, getheaders(token));

    if (!res.ok) {
        throw new Error(res.statusText);
    }

    return res.json();
}

export function useTopicList() {
    const { token, isLoading } = useToken();
    return useQuery({
        queryKey: ['topicList'],
        queryFn: () => topicList(token!),
        enabled: !isLoading,
    });
}
