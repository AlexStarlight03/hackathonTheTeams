import type { Page } from "../App";

type Props = {
    navigate: (page: Page) => void;
};

export default function Navbar({ navigate }: Props) {
    return (
        <nav className="navbar">
            <h2>MindHarbor</h2>

            <div className="nav-links">
                <button onClick={() => navigate({ name: "home" })}>Accueil</button>
                <button onClick={() => navigate({ name: "groups" })}>Groupes</button>
                <button onClick={() => navigate({ name: "events" })}>Évènements</button>
                <button onClick={() => navigate({ name: "ressources" })}>Ressources</button>
            </div>
        </nav>
    );
}