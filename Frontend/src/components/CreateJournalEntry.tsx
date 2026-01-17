import { useState } from "react";
import { createJournalEntry as createJournalEntryApi } from "../services/journal";

type Props = {
    userId: number;
    onCreate: () => void;
    onCancel: () => void;
};

export default function CreateJournalEntry({ userId, onCreate, onCancel }: Props) {
    const [humeur, setHumeur] = useState("");
    const [energie, setEnergie] = useState("");
    const [sommeil, setSommeil] = useState("");
    const [anxiete, setAnxiete] = useState("");
    const [journal, setJournal] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        await createJournalEntryApi(userId, {
            humeur: Number(humeur),
            energie: Number(energie),
            sommeil: Number(sommeil),
            anxiete: Number(anxiete),
            journal,
            date: new Date(),
        });

        setHumeur("");
        setEnergie("");
        setSommeil("");
        setAnxiete("");
        setJournal("");
        setLoading(false);
        onCreate();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Nouvelle entrée de journal</h3>
            <label>
                Humeur (0-10):
                <input required
                    type="number"
                    min={0}
                    max={10}
                    value={humeur}
                    onChange={(e) => setHumeur(e.target.value)}
                />
            </label>
            <label>
                Énergie (0-10):
                <input required
                    type="number"
                    min={0}
                    max={10}
                    value={energie}
                    onChange={(e) => setEnergie(e.target.value)}
                />
            </label>
            <label>
                Qualité du sommeil (0-10):
                <input required
                    type="number"
                    min={0}
                    max={10}
                    value={sommeil}
                    onChange={(e) => setSommeil(e.target.value)}
                />
            </label>
            <label>
                Niveau d'anxiété (0-10):
                <input required
                    type="number"
                    min={0}
                    max={10}
                    value={anxiete}
                    onChange={(e) => setAnxiete(e.target.value)}
                />
            </label>
            <label>
                Journal (optionnel):
                <textarea
                    value={journal}
                    onChange={(e) => setJournal(e.target.value)}
                    placeholder="Écrivez vous pensées..."
                />
            </label>

            <button type="button" onClick={onCancel}>
                Annuler
            </button>
            <button type="submit" disabled={loading}>
                {loading ? "Création..." : "Créer l'entrée"}
            </button>
        </form>
    );
}