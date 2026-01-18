import { useEffect, useState } from "react";
import {getUserIdFromToken} from "../services/auth";
import type { FilDiscussion } from "../types";
import CreateDiscussionForm from "../components/CreateDiscussionForm";
import { getFilDiscussionsUserGroup, getFilDiscussionsUserPrivate} from "../services/filDiscussion";
import DiscussionCard from "../components/DiscussionCard";

type Props = {
    navigate: (page: any) => void;
};

export default function DiscussionsList({ navigate }: Props) {
    const [privateDiscussions, setPrivateDiscussions] = useState<FilDiscussion[]>([]);
    const [groupDiscussions, setGroupDiscussions] = useState<FilDiscussion[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const userId = getUserIdFromToken();
    const isLoggedIn = !!userId;

    const loadDiscussions = () => {
        if (userId) {
            getFilDiscussionsUserPrivate(userId).then(setPrivateDiscussions);
            getFilDiscussionsUserGroup(userId).then(setGroupDiscussions);
        }
    };

    useEffect(() => {
        loadDiscussions();
    }, [userId]);

    return (
        <div className="page-container">
            <h1>Mes Discussions</h1>
            <section>
                <h3>Discussions privées</h3>
                {isLoggedIn && (
                    <>
                        {!showCreateForm && (
                            <button onClick={() => setShowCreateForm(true)}>
                                Créer une discussion privée
                            </button>
                        )}
                        {showCreateForm && (
                            <CreateDiscussionForm
                                userId={userId}
                                onCreate={() => {
                                    setShowCreateForm(false);
                                    loadDiscussions();
                                }}
                                onCancel={() => setShowCreateForm(false)}
                            />
                        )}
                    </>
                )}
                {privateDiscussions.length === 0 && <p>Aucune discussion privée</p>}
                <div>
                    {privateDiscussions.map((pdiscussion) => (
                        <DiscussionCard
                            key={pdiscussion.id}
                            discussion={pdiscussion}
                            onChange={loadDiscussions}
                            navigate={navigate}
                        />
                    ))}
                </div>
            </section>
            <section>
                <h3>Discussions de groupe</h3>
                {groupDiscussions.length === 0 && <p>Aucune discussion de groupe</p>}
                <div>
                    {groupDiscussions.map((gdiscussion) => (
                        <DiscussionCard
                            key={gdiscussion.id}
                            discussion={gdiscussion}
                            onChange={loadDiscussions}
                            navigate={navigate}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
