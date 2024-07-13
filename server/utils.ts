import { nanoid } from 'nanoid';

export function randomId() {
    return nanoid();
}

export function prefixId(prefix: string) {
    return `${prefix}_${randomId()}`;
}
