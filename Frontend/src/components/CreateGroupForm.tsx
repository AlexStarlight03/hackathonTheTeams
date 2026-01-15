import { useState } from "react";
import { createGroup } from "../services/group";

type Props = {
    userId: number;
    onCreate: () => void;
    onCancel: () => void;
};

export default function CreateGroupForm({ userId, onCreate, onCancel}: Props) {
    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [new_inscription, setnew_inscription] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        await createGroup({
            nom,
            description,
            new_inscription,
            createurId: userId,
        });

        setNom("");
        setDescription("");
        setnew_inscription(false);
        setLoading(false);
        onCreate();
    };

    return (
        <form onSubmit={handleSubmit}>
        <h3>Créer un nouveau groupe</h3>
        <input required
            placeholder="Nom du groupe"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
        />
        <textarea required
            placeholder="Description du groupe"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        />
        <input required type="checkbox"
            checked={new_inscription}
            onChange={(e) => setnew_inscription(e.target.checked)}
        />
        <button type="button" onClick={onCancel}>
            Annuler
        </button>
        <button type="submit" disabled={loading}>
            {loading ? "Création..." : "Créer le groupe"}
        </button>
    </form>
    );
}