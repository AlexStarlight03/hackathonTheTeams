import type { User } from './user';
import type { Group } from './group';
import type { Message } from './message';

export interface FilDiscussion {
  id: number;
  titre: string;
  groupeId?: number | null;
  participants: User[];
  groupe?: Group | null;
  messages: Message[];
}