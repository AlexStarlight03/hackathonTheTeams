import type { User } from './user';

export interface Journal {
    id :number;
    user: User;
    date: Date;
    humeur: number;
    energie: number;
    sommeil: number;
    anxiete: number;
    journal: String;
}