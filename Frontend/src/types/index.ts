export * from './filDiscussion';
export * from './message';
export * from './user';
export * from './group';
export * from './evenement';
export * from './ressource';
export * from './professionnel';
export * from './journal';
// export interface User {
//     id: number;
//     nom: string;
//     prenom: string;
//     email: string;
//     professionnel: boolean;
//     creation_date: string;

//     professionnelProfil?: Professionnel | null;
//     groupes?: Group[];
//     groupesModerateur?: Group[];
//     eventModerateur?: Evenement[];
//     conversations?: FilDiscussion[];
//     messagesEnvoyes?: Message[];
//     journal?: JournalEntry[];
// }


// export interface Professionnel {
//     id: number;
//     qualification: string;

//     user?: User;
//     ressourcesCrees?: Ressource[];
//     groupesCrees?: Group[];
// }


// export interface Group {
//     id: number;
//     createurId: number;
//     nom: string;
//     description: string;
//     new_inscription: boolean;

//     createur?: Professionnel;
//     membres?: User[];
//     moderateurs?: User[];
//     evenements?: Evenement[];
//     discussions?: FilDiscussion[];
// }


// export interface Ressource {
//     id: number;
//     professionalId: number;
//     nom: string;
//     description: string;
//     professionnel?: Professionnel;
// }

// export interface JournalEntry {
//     id: number;
//     userId: number;
//     date: string;
//     humeur: number;
//     energie: number;
//     sommeil: number;
//     anxiete: number;
//     journal?: string | null;
//     modification: boolean;

//     user?: User;
// }

// export interface Evenement {
//     id: number;
//     id_moderateur: number;
//     nom: string;
//     groupeId: number;
//     date: string;
//     description: string;
//     moderateur?: User;
//     groupe?: Group;
// }

// export interface FilDiscussion {
//     id: number;
//     titre?: string;
//     groupeId?: number | null;

//     participants?: User[];
//     messages?: Message[];
//     groupe?: Group | null;
// }

// export interface Message {
//     id: number;
//     id_discussion: number;
//     time: string;
//     message: string;
//     emmeteurId: number;

//     discussion?: FilDiscussion;
//     emmeteur?: User;
// }
