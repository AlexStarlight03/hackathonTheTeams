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
        <div className="page-container">
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
            <div className="search-section">
                <input
                    className="search-bar"
                    type="search"
                    placeholder="Rechercher une ressource"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <button className="search-btn" onClick={() => setSearch(searchInput)}>
                    Rechercher
                </button>
            </div>
            {filteredRessources.length === 0 && (
                <p>Aucune ressource trouvée.</p>
            )}
            {filteredRessources.map((ressource) => (
                <RessourceCard key={ressource.id} ressource={ressource} />
            ))}
        </div>
    );
}