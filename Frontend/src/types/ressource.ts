import { Professionnel } from "./professionnel";

export interface Ressource {
    id: number;
    professionnel: Professionnel;
    nom: string;
    description: string;
}
