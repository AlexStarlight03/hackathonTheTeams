import type { Evenement } from "../types";
import { getUserIdFromToken } from "../services/auth";

type Props = {
  evenement: Evenement;
  onEdit?: (evenement: Evenement) => void;
  onDelete?: (evenement: Evenement) => void;
};

export default function EvenementCard({ evenement, onEdit, onDelete }: Props) {
    const userId = getUserIdFromToken();
    const isCreator = evenement.moderateur.id === userId;
    return (
        <div className="event-card">
            <h2>{evenement.nom}</h2>
            <p>{evenement.groupe ? evenement.groupe.nom : ""}</p>
            <p>{evenement.description}</p>
            <p>Date: {new Date(evenement.date).toLocaleString()}</p>
            <p>Modérateur: {evenement.moderateur ? evenement.moderateur.nom : "Non assigné"}</p>
            {isCreator && (
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button onClick={() => onEdit && onEdit(evenement)}>Éditer</button>
                <button onClick={() => onDelete && onDelete(evenement)}>Supprimer</button>
                </div>
            )}
        </div>
    );
}