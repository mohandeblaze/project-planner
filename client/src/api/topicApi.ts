import { api } from ".";

export async function topicList() {
    const res = await api.topics.$get();

    if (!res.ok) {
        throw new Error(res.statusText);
    }

    return res.json();
}
