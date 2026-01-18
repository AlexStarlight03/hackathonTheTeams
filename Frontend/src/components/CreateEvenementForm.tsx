import { useState } from "react";
import { createEvenement, updateEvenement } from "../services/evenement";
import type { Evenement } from "../types";

type Props = {
    groupId: number;
    userId: number;
    onCreate: () => void;
    onCancel: () => void;
    evenement?: Evenement;
};

export default function CreateEvenementForm({ groupId, userId, onCreate, onCancel, evenement}: Props) {
    const [nom, setNom] = useState(evenement?.nom || "");
    const [description, setDescription] = useState(evenement?.description || "");
    const [date, setDate] = useState(
     evenement
        ? new Date(evenement.date).toISOString().slice(0, 16)
        : ""
    );
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (evenement) {
            await updateEvenement(evenement.id, userId, {
                nom,
                description,
                date,
                groupeId: groupId,
            });
        } else {
            await createEvenement(userId, {
                nom,
                description,
                date,
                groupeId: groupId,
            });
        }

        setNom("");
        setDescription("");
        setDate("");
        setLoading(false);
        onCreate();
    };

    return (
        <form onSubmit={handleSubmit}>
        <h3>Créer un nouvel événement</h3>
        <input required
            placeholder="Nom de l'événement"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
        />
        <textarea required
            placeholder="Description de l'événement"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        />
        <input required type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
        />
        <button type="button" onClick={onCancel}>
            Annuler
        </button>
        <button type="submit" disabled={loading}>
            {loading ? "Création..." : "Créer l'événement"}
        </button>
    </form>
    );
}