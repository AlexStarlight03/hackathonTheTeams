import { useState } from "react";
import { createGroupDiscussion, createPrivateDiscussion } from "../services/filDiscussion";
import { getGroupById } from "../services/group";
import { getAllUsers } from "../services/user";
import type { User } from "../types/user";

type Props = {
    userId: number;
    groupId?: number;
    participantIds?: number[];
    onCreate: () => void;
    onCancel: () => void;
};

export default function CreateDiscussionForm({ userId, groupId, participantIds, onCreate, onCancel }: Props) {
    const [titre, setTitre] = useState("Discussion");
    const [participants, setParticipants] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [showUsers, setShowUsers] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);

    const fetchUsers = async () => {
        setUsersLoading(true);
        if (groupId) {
            const group = await getGroupById(groupId);
            setUsers(group.membres || []);
        } else {
            const allUsers = await getAllUsers();
            setUsers(allUsers);
        }
        setUsersLoading(false);
    };

    const handleShowUsers = async (e: React.MouseEvent) => {
        e.preventDefault();
        setShowUsers(!showUsers);
        if (!showUsers && users.length === 0) {
            await fetchUsers();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);

        try {
            if (groupId) {
                let ids: number[] | undefined = participantIds;
                if (!ids && participants) {
                    ids = participants.split(",").map((id) => Number(id.trim())).filter(Boolean);
                }
                await createGroupDiscussion(titre, groupId, ids);
            } else {
                let ids: number[] = participantIds ?? [];
                if (participants) {
                    ids = participants.split(",").map((id) => Number(id.trim())).filter(Boolean);
                }
                if (!ids.includes(userId)) {
                    ids.push(userId);
                }
                await createPrivateDiscussion(titre, ids);
            }
            setTitre("Discussion");
            setParticipants("");
            setLoading(false);
            onCreate();
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Créer une discussion {groupId ? "de groupe" : "privée"}</h3>
            <button onClick={handleShowUsers} type="button">
                Voir utilisateurs disponibles
            </button>
            {showUsers && (
                <div>
                    {usersLoading ? (
                        <p>Chargement des utilisateurs...</p>
                    ) : (
                        <ul>
                            {users.map((user) => (
                                <li key={user.id}>
                                    {user.prenom} {user.nom} (ID: {user.id})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            <label>
                Titre:
                <input
                    type="text"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                />
            </label>
            {groupId && (
                <label>
                    Participants (IDs séparés par des virgules, incluez-vous):
                    <input
                        type="text"
                        value={participants}
                        onChange={(e) => setParticipants(e.target.value)}
                        placeholder="ex: 1,2,3"
                        required
                    />
                </label>
            )}
            <button type="button" onClick={onCancel}>
                Annuler
            </button>
            <button type="submit" disabled={loading}>
                {loading ? "Création..." : "Créer la discussion"}
            </button>
        </form>
    );
}