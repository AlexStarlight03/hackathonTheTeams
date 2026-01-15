import { useEffect, useState } from "react";
import { getGroups } from "../services/group";
import type { Group } from "../types";
import GroupCard from "../components/GroupCard";

type Props = {
  onSelectGroup: (id: number) => void;
};

export default function GroupsList({ onSelectGroup }: Props) {
    const [groups, setGroups] = useState<Group[]>([]);
    const [search, setSearch] = useState("");
    const [openGroups, setOpenGroups] = useState(false);

    useEffect(() => {
        getGroups().then(setGroups);
    }, []);

    const filteredGroups = groups.filter((group) =>
        group.nom.toLowerCase().includes(search.toLowerCase()) &&
        (!openGroups || group.new_inscription)
    );

    {filteredGroups.map((group) => (
        <div key={group.id} onClick={() => onSelectGroup(group.id)}>
            <GroupCard group={group} />
        </div>
    ))}

    return (
        <div>
            <h1>Groupes</h1>

            <input
            placeholder="Rechercher un groupe"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
            <label>
                <input
                    type="checkbox"
                    checked={openGroups}
                    onChange={(e) => setOpenGroups(e.target.checked)}
                />
                Groupes accueillant de nouveaux membres
            </label>

            {filteredGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
            ))}
        </div>
    );
}
