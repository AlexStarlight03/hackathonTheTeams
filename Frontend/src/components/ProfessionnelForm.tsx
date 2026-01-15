import { useState } from "react";

type Props = {
    onSubmit: (qualifications: string) => void;
    onCancel: () => void;
    loading?: boolean;
};

export default function ProfessionnelForm({ onSubmit, onCancel, loading }: Props) {
    const [qualifications, setQualifications] = useState("");

    return (
        <div className="modaloverlay">
            <div className="modal-content">
                <h3>Devenir un professionel</h3>
                <textarea
                    placeholder="Entrez vos qualifications"
                    value={qualifications}
                    onChange={e => setQualifications(e.target.value)}
                    rows={4}
                />
                <div>
                    <button onClick={() => onSubmit(qualifications)} disabled={loading || !qualifications.trim()}>
                        {loading ? "Soumission..." : "Soumettre"}
                    </button>
                    <button onClick={onCancel}>Annuler</button>
                </div>
            </div>
        </div>
    );
}