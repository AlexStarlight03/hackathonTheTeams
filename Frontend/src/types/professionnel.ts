import type { User } from "./user";

export interface Professionnel extends User {
    user : User;
    qualification: string;
}