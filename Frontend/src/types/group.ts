import type { User } from './user';
import type { Evenement } from './evenement';
import type { FilDiscussion } from './filDiscussion';

export interface Group {
    id : number;
    createurId : number;
    nom : string;
    description : string;
    dateCreation : string; // ISO date string
    membres : User[];
    moderateurs : User[];
    new_inscription: boolean;
    evenementsIds : Evenement[];
    discussions : FilDiscussion[];
}



