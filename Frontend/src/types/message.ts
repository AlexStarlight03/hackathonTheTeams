import type { User } from './user';
import type { FilDiscussion } from './filDiscussion';

export interface Message {
    id: number;
    id_discussion: FilDiscussion['id'];
    time: string;
    message: string;
    emmeteur: User['id'];
}