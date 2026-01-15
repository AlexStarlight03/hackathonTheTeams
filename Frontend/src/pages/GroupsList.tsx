import { useEffect, useState } from "react";
import { getGroups } from "../services/group";
import type { Group } from "../types";
import GroupCard from "../components/GroupCard";
import CreateGroupForm from "../components/CreateGroupForm";
import {getUserIdFromToken, isUserProfessional} from "../services/auth";

type Props = {
  onSelectGroup: (id: number) => void;
};

export default function GroupsList({ onSelectGroup }: Props) {
    const [groups, setGroups] = useState<Group[]>([]);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [openGroups, setOpenGroups] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const userId = getUserIdFromToken();
    const isProfessional = isUserProfessional();

    useEffect(() => {
        getGroups().then(setGroups);
    }, []);

    const filteredGroups = groups.filter((group) =>
        group.nom.toLowerCase().includes(search.toLowerCase()) &&
        (!openGroups || group.new_inscription)
    );

    return (
        <div>
            <h1>Groupes</h1>
            {isProfessional && userId && (
                <>
                {!showCreateForm && (
                    <button onClick={() => setShowCreateForm(true)}>Créer un nouveau groupe</button>
                )}
                {showCreateForm && (
                    <CreateGroupForm
                        userId={userId}
                        onCreate={() => {
                            setShowCreateForm(false);
                            getGroups().then(setGroups);
                        }}
                        onCancel={() => setShowCreateForm(false)}
                    />
                )}
                </>
            )}
            <input
            placeholder="Rechercher un groupe"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            />
            <label>
                <input
                    type="checkbox"
                    checked={openGroups}
                    onChange={(e) => setOpenGroups(e.target.checked)}
                />
                Groupes accueillant de nouveaux membres
            </label>
            <button onClick={() => setSearch(searchInput)} >Rechercher</button>

            {filteredGroups.map((group) => (
                <div key={group.id} onClick={() => onSelectGroup(group.id)} style={{ cursor: "pointer" }}>
                <GroupCard key={group.id} group={group} />
                </div>
            ))}
        </div>
    );
}
