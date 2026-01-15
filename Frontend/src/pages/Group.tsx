import { useEffect, useState } from "react";
import { getGroupById, joinGroup, leaveGroup } from "../services/group";
import { getEvenementsByGroupId } from "../services/evenement";
import type { Group, Evenement } from "../types";
import { getUserIdFromToken } from "../services/auth";
import CreateEvenementForm from "../components/CreateEvenementForn";

type Props = {
    groupId: number;
    onBack: () => void;
};

export default function GroupPage({ groupId, onBack }: Props) {
   const [group, setGroup] = useState<Group | null>(null);
   const [evenements, setEvenements] = useState<Evenement[]>([]);
   const [loading, setLoading] = useState(true);
   const [showCreateEvenementForm, setShowCreateEvenementForm] = useState(false);

   const userId = getUserIdFromToken();

   const isModerator = group?.moderateurs?.some((mod) => mod.id === userId);

    const loadData = async () => {
        setLoading(true);
        const [groupData, evenementsData] = await Promise.all([
            getGroupById(groupId),
            getEvenementsByGroupId(groupId),
        ]);
        setGroup(groupData);
        setEvenements(evenementsData);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [groupId]);

    if (loading) {
        return <div>Loading...</div>;
    }
    if (!group) {
        return <div>Group not found</div>;
    }

    const isMember = group.membres?.some((membre) => membre.id === userId);

    return (
        <div>
            <button onClick={onBack}>Retour liste des groupes</button>
            <h1>{group.nom}</h1>
            <p>{group.description}</p>
             {/* JOIN / LEAVE */}
            {isMember ? (
                <button onClick={() => leaveGroup(groupId, userId).then(loadData)}>Quitter le groupe</button>
            ) : (
                <button onClick={() => joinGroup(groupId, userId).then(loadData)}>Rejoindre le groupe</button>
            )}

            {/*Membres*/}
            <h3>Membres ({group.membres?.length ?? 0})</h3>
            <ul>
                {group.membres?.map((membre) => (
                    <li key={membre.id}>
                        {membre.prenom} {membre.nom}
                    </li>
                ))}
            </ul>
            {/*Événements*/}
            <h3>Événements du groupe</h3>
            {/*Moderateurs seulement*/}
            {isModerator && (
                <>
                {!showCreateEvenementForm && (
                    <button onClick={() => setShowCreateEvenementForm(true)}>
                        Créer un événement
                    </button>
                )}
                {showCreateEvenementForm && (
                <CreateEvenementForm
                    groupId = {group.id}
                    userId={userId}
                    onCreate={() => {
                        setShowCreateEvenementForm(false);
                        loadData();
                    }}
                    onCancel={() => setShowCreateEvenementForm(false)}
                    />
                    )}
                </>
            )}
            {evenements.length === 0 &&  <p>Aucun événement</p>}

            {evenements.map((evenement) => (
                <div key={evenement.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                    <h4>{evenement.nom}</h4>
                    <p>{new Date(evenement.date).toLocaleString()}</p>
                    <p>{evenement.description}</p>
                    </div>
            ))}
        </div>
    );
}