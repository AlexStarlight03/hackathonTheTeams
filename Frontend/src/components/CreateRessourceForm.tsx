import { useState, useEffect } from "react";
import { createRessource } from "../services/ressource";
import { getProfessionnelById } from "../services/professionnel";

type Props = {
    userId: number;
    onCreate: () => void;
    onCancel: () => void;
};

export default function CreateRessourceForm({ userId, onCreate, onCancel}: Props) {
    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await createRessource(userId, { nom, description, professionnel: { id: userId } });
        setNom("");
        setDescription("");
        setLoading(false);
        onCreate();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Créer une ressource</h3>
            <input
                required
                placeholder="Nom de la ressource"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
            />
            <textarea
                required
                placeholder="Description de la ressource"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button type="button" onClick={onCancel}>
                Annuler
            </button>
            <button type="submit" disabled={loading}>
                {loading ? "Création..." : "Créer"}
            </button>
        </form>
    );
}