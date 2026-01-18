import { useEffect, useState } from "react";
import { getAllEvenements} from "../services/evenement";
import type { Evenement } from "../types";
import EvenementCard from "../components/EvenementCard";


export default function EvenementsList() {
    const [evenements, setEvenements] = useState<Evenement[]>([]);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        getAllEvenements().then(setEvenements);
    }, []);

    const filteredEvenements = evenements.filter((evenement) =>
        evenement.nom.toLowerCase().includes(search.toLowerCase())
    );

    {filteredEvenements.map((evenement) => (
        <div>
            <EvenementCard evenement={evenement} />
        </div>
    ))}

    return (
        <div className="page-container">
            <h1>Évènements</h1>
            <div className="search-section">
                <input
                    className="search-bar"
                    type="search"
                    placeholder="Rechercher un événement"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <button className="search-btn" onClick={() => setSearch(searchInput)}>
                    Rechercher
                </button>
            </div>
            {filteredEvenements.length === 0 && (
                <p>Aucun événement trouvé.</p>
            )}
            {filteredEvenements.map((evenement) => (
                <EvenementCard key={evenement.id} evenement={evenement} />
            ))}
        </div>
    );
}
