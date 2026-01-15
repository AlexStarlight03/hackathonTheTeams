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
        <div>
            <h1>Évènements</h1>
            <input
            placeholder="Rechercher un événement"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            />
            <button onClick={() => setSearch(searchInput)} >Rechercher</button>
            {filteredEvenements.map((evenement) => (
                <div>
                    <EvenementCard evenement={evenement} />
                </div>
            ))}
        </div>
    );
}
