import type { User } from './user';
import type { Evenement } from './evenement';
import type { Discussions } from './filDiscussion';

export interface Group {
    id : number;
    createurId : User['id'];
    nom : string;
    description : string;
    dateCreation : string; // ISO date string
    membres : User[];
    moderateurs : User[];
    evenementsIds : Evenement[];
    dicussion : Discussions[];
}



