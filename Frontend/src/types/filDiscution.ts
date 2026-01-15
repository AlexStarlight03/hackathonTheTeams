import type { User } from './user';
import type { Group } from './group';
import type { Message } from './message';

export interface FilDiscussion {
  id: number;
  title: string;
  groupe?: Group;
  participants: User[];
  messages: Message[];
}
