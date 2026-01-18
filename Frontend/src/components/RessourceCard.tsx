import type { Ressource } from "../types";

export default function RessourceCard({ ressource }: { ressource: Ressource }) {
    return (
        <div className="ressource-card">
            <h2>{ressource.nom}</h2>
            <p>{ressource.description}</p>
            <p>Créateur : {ressource.professionnel.id}</p>
        </div>
    );
}