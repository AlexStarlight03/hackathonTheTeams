import { useEffect, useState } from "react";
import { getAllRessources } from "../services/ressource";
import type { Ressource } from "../types";
import RessourceCard from "../components/RessourceCard";


export default function RessourcesList() {
    const [ressources, setRessources] = useState<Ressource[]>([]);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        getAllRessources().then(setRessources);
    }, []);

    const filteredRessources = ressources.filter((ressource) =>
        ressource.nom.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h1>Ressources</h1>

            <input
            placeholder="Rechercher une ressource"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            />
            <button onClick={() => setSearch(searchInput)} >Rechercher</button>
            {filteredRessources.map((ressource) => (
                <div key={ressource.id}>
                <RessourceCard ressource={ressource} />
                </div>
            ))}
        </div>
    );
}
