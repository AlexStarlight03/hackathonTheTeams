import { useState } from "react";
import { createEvenement } from "../services/evenement";

type Props = {
    groupId: number;
    userId: number;
    onCreate: () => void;
    onCancel: () => void;
};

export default function CreateEvenementForm({ groupId, userId, onCreate, onCancel}: Props) {
    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        await createEvenement(userId, {
            nom,
            description,
            date,
            groupeId: groupId,
        });

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