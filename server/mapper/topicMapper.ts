import { UTCDate } from '@date-fns/utc';
import {
    topicSchema,
    type createTopicSchemaType,
    type Topic,
} from '@project-planner/shared-schema';
import { prefixId } from '../utils';

class Mapper {
    mapToModel(params: { id: string; userId: string; topic: createTopicSchemaType }) {
        const { id, userId, topic } = params;

        const createTopic: Topic = {
            ...topic,
            id: id,
            userId: userId,
            createdAt: new UTCDate(),
            updatedAt: new UTCDate(),
            pullRequests: topic.pullRequests.map((pr) => ({
                ...pr,
                id: prefixId('pr'),
                topicId: id,
                type: pr.type,
                url: pr.url,
                createdAt: new UTCDate(),
                updatedAt: new UTCDate(),
            })),
            tasks: topic.tasks.map((task) => ({
                ...task,
                id: prefixId('task'),
                topicId: id,
                createdAt: new UTCDate(),
                updatedAt: new UTCDate(),
            })),
        };

        return topicSchema.parse(createTopic);
    }
}

export const topicMapper = new Mapper();
