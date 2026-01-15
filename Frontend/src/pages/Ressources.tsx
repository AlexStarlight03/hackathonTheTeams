import { useEffect, useState } from "react";
import { getAllRessources } from "../services/ressource";
import type { Ressource } from "../types";
import RessourceCard from "../components/RessourceCard";


export default function RessourcesList() {
    const [ressources, setRessources] = useState<Ressource[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getAllRessources().then(setRessources);
    }, []);

    const filteredRessources = ressources.filter((ressource) =>
        ressource.nom.toLowerCase().includes(search.toLowerCase())
    );

    {filteredRessources.map((ressource) => (
        <div>
            <RessourceCard ressource={ressource} />
        </div>
    ))}

    return (
        <div>
            <h1>Ressources</h1>

            <input
            placeholder="Rechercher une ressource"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
            {filteredRessources.map((ressource) => (
                <div>
                <RessourceCard key={ressource.id} ressource={ressource} />
                </div>
            ))}
        </div>
    );
}
