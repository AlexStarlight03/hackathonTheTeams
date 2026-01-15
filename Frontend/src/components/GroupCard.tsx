import type { Group } from "../types";

export default function GroupCard({ group }: { group: Group }) {
    return (
        <div className="group-card">
            <h2>{group.nom}</h2>
            <p>{group.description}</p>
            <p>Créateur ID: {group.createurId}</p>
            <p>Modérateurs: {group.moderateurs && group.moderateurs.length > 0
                ? group.moderateurs.map((mod) => mod.nom) : "Aucun"}</p>
            <p>Nouveaux membres acceptés: {group.new_inscription ? 'Oui' : 'Non'}</p>
        </div>
    );
}