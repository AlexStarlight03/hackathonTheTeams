import { useEffect, useState } from "react";
import { getAllRessources } from "../services/ressource";
import type { Ressource } from "../types";
import RessourceCard from "../components/RessourceCard";
import {getUserIdFromToken, isUserProfessional} from "../services/auth";
import CreateRessourceForm from "../components/CreateRessourceForm";



export default function RessourcesList() {
    const [ressources, setRessources] = useState<Ressource[]>([]);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);

    const userId = getUserIdFromToken();
    const isProfessional = isUserProfessional();

    useEffect(() => {
        getAllRessources().then(setRessources);
    }, []);

    const filteredRessources = ressources.filter((ressource) =>
        ressource.nom.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h1>Ressources</h1>
            {isProfessional && userId && (
                <>
                {!showCreateForm && (
                    <button onClick={() => setShowCreateForm(true)}>Créer une nouvelle ressource</button>
                )}
                {showCreateForm && (
                    <CreateRessourceForm
                        userId={userId}
                        onCreate={() => {
                            setShowCreateForm(false);
                            getAllRessources().then(setRessources);
                        }}
                        onCancel={() => setShowCreateForm(false)}
                    />
                )}
                </>
            )}
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
