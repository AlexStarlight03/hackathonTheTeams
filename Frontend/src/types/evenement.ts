import type { User } from './user';
import type { Group } from './group';

export interface Evenement {
  id: number;
  moderateur: User;
  nom: string;
  groupe: Group;
  date: Date;
  description: string;

}