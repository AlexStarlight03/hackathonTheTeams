import type { FilDiscussion } from "../types";
import { getUserIdFromToken } from "../services/auth";
import { updateDiscussion } from "../services/filDiscussion";

type Props = {
    discussion: FilDiscussion;
    onChange?: () => void;
    navigate: (page: any) => void;
};


export default function DiscussionCard({ discussion, onChange, navigate }: Props) {
    const userId = getUserIdFromToken();
    const isParticipant = discussion.participants?.some((p) => p.id === userId);
    const isLoggedIn = !!localStorage.getItem("token");
    const isGroupDiscussion = !!discussion.groupe;
    const isGroupMember = isGroupDiscussion
        ? discussion.groupe?.membres?.some((m: any) => m.id === userId)
        : true
    const canJoinOrLeave = isLoggedIn && isGroupMember;

    const handleJoin = async () => {
        await updateDiscussion(discussion.id, { addParticipantIds: [userId] });
        onChange && onChange();
    };

    const handleLeave = async () => {
        await updateDiscussion(discussion.id, { removeParticipantIds: [userId] });
        onChange && onChange();
    };

    const handleCardClick = () => {
        if (discussion.groupe && isParticipant) {
            navigate({ name: "chat",
                discussionId: discussion.id,
                userId: userId,
                groupId: discussion.groupeId,
                type: "group"
            });
        } else if (!discussion.groupe && isParticipant) {
            navigate({ name: "chat",
                discussionId: discussion.id,
                userId: userId,
                type: "private"
            });
        }
    };

    return (
        <div className="discussion-card" onClick={handleCardClick} style={{ cursor: isParticipant ? 'pointer' : 'default' }}>
            <h2>{discussion.titre}</h2>
            {/* <p>{discussion.groupe ? discussion.groupe.nom : ""}</p> */}
            {canJoinOrLeave ? (
                isParticipant ? (
                    <button onClick={handleLeave}>Quitter la discussion</button>
                ) : (
                    <button onClick={handleJoin}>Rejoindre la discussion</button>
                )
            ) : isGroupDiscussion && !isGroupMember? (
                <p>Vous devez être membre du groupe pour rejoindre cette discussion.</p>
            ) : (
                <p>Connectez-vous pour rejoindre la discussion.</p>
            )}
        </div>
    );
}