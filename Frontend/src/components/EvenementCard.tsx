import type { Evenement } from "../types";

export default function GroupCard({ evenement }: { evenement: Evenement }) {
    return (
        <div className="event-card">
            <h2>{evenement.nom}</h2>
            <p>{evenement.groupe ? evenement.groupe.nom : ""}</p>
            <p>{evenement.description}</p>
            <p>Date: {new Date(evenement.date).toLocaleString()}</p>
            <p>Modérateur: {evenement.moderateur ? evenement.moderateur.nom : "Non assigné"}</p>
        </div>
    );
}