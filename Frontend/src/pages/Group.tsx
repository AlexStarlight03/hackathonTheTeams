import { useEffect, useState } from "react";
import { getGroupById, joinGroup, leaveGroup , addModerateur, deleteModerateur, deleteGroup} from "../services/group";
import { getEvenementsByGroupId } from "../services/evenement";
import type { Group, Evenement, FilDiscussion } from "../types";
import { getUserIdFromToken } from "../services/auth";
import CreateEvenementForm from "../components/CreateEvenementForm";
import CreateDiscussionForm from "../components/CreateDiscussionForm";
import { getFilDiscussionsByGroupId} from "../services/filDiscussion";
import DiscussionCard from "../components/DiscussionCard";
import EvenementCard from "../components/EvenementCard";

type Props = {
    groupId: number;
    onBack: () => void;
    navigate: (page: any) => void;
};

export default function GroupPage({ groupId, onBack, navigate }: Props) {
   const [group, setGroup] = useState<Group | null>(null);
   const [evenements, setEvenements] = useState<Evenement[]>([]);
   const [discussions, setDiscussions] = useState<FilDiscussion[]>([]);
   const [loading, setLoading] = useState(true);
   const [showCreateEvenementForm, setShowCreateEvenementForm] = useState(false);
   const [showCreateDiscussionForm, setShowCreateDiscussionForm] = useState(false);

   const userId = getUserIdFromToken();

   const isModerator = group?.moderateurs?.some((mod) => mod.id === userId);
   const isLoggedIn = !!localStorage.getItem("token");
   const isCreateur = group?.createurId === userId;

    const loadData = async () => {
        setLoading(true);
        const [groupData, evenementsData, discussionsData] = await Promise.all([
            getGroupById(groupId),
            getEvenementsByGroupId(groupId),
            getFilDiscussionsByGroupId(groupId)
        ]);
        setGroup(groupData);
        setEvenements(evenementsData);
        setDiscussions(discussionsData);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [groupId]);

    useEffect(() => {
        console.log("Discussions loaded:", discussions);
    }, [discussions]);

    if (loading) {
        return <div>Loading...</div>;
    }
    if (!group) {
        return <div>Group not found</div>;
    }

    const membres = Array.isArray(group?.membres) ? group.membres : [];
    const isMember = group.membres?.some((membre) => membre.id === userId);

    return (
        <div>
            <button onClick={onBack}>Retour liste des groupes</button>
            <h1>{group.nom}</h1>
            <p>{group.description}</p>
            {/* JOIN / LEAVE */}
            {isLoggedIn && (
            isMember ? (
                <button onClick={() => leaveGroup(groupId, userId).then(loadData)}>
                Quitter le groupe
                </button>
            ) : (
                <button onClick={() => joinGroup(groupId, userId).then(loadData)}>
                Rejoindre le groupe
                </button>
            )
            )}
            {isMember && isLoggedIn && isCreateur && (
                <button
                    onClick={async () => {
                        await deleteGroup(groupId, userId);
                        loadData();
                    }}>
                    Supprimer le groupe
                </button>
            )}

            {/*Membres*/}
            <h3>Membres ({membres.length})</h3>
            <ul>
                {membres.map((membre) => (
                    <li key={membre.id}>
                        {membre.prenom} {membre.nom}
                    </li>
                ))}
            </ul>
            {isMember && isLoggedIn && !isModerator && (
                <button
                    onClick={async () => {
                        await addModerateur(groupId, userId);
                        loadData();
                    }}
                >
                    Devenir Modérateur du groupe
                </button>
            )}
            {isMember && isLoggedIn && isModerator && (
                <button
                    onClick={async () => {
                        await deleteModerateur(groupId, userId);
                        loadData();
                    }}
                >
                    Ne plus être Modérateur du groupe
                </button>
            )}
             {/*Discussions*/}
            <h3>Fils du discussions du groupe</h3>
            {/*Membres seulement*/}
            {isLoggedIn && isMember && (
                <>
                {!showCreateDiscussionForm && (
                    <button onClick={() => setShowCreateDiscussionForm(true)}>
                        Créer un nouveau fil de discussion
                    </button>
                )}
                {showCreateDiscussionForm && (
                <CreateDiscussionForm
                    groupId = {group.id}
                    userId={userId}
                    onCreate={() => {
                        setShowCreateDiscussionForm(false);
                        loadData();
                    }}
                    onCancel={() => setShowCreateDiscussionForm(false)}
                    />
                    )}
                </>
            )}
            {discussions.length === 0 && <p>Aucun fil de discussion</p>}

            {discussions.map((discussion) => (
                <DiscussionCard
                    key={discussion.id}
                    discussion={discussion}
                    onChange={loadData}
                    navigate={navigate}
                />
            ))}
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
                        getFilDiscussionsByGroupId(group.id).then(setDiscussions);
                    }}
                    onCancel={() => setShowCreateEvenementForm(false)}
                    />
                    )}
                </>
            )}
            {evenements.length === 0 &&  <p>Aucun événement</p>}

            {evenements.map((evenement) => (
                <EvenementCard key={evenement.id} evenement={evenement} />
            ))}
        </div>
    );
}