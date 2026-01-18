import type { Page } from "../App";

type Props = {
    navigate: (page: Page) => void;
    isLoggedIn: boolean;
    userId?: number;
};

export default function Navbar({ navigate, isLoggedIn, userId }: Props) {
    return (
        <nav className="navbar">
            <h2>MindHarbor</h2>

            <div className="nav-links">
                <button onClick={() => navigate({ name: "home" })}>Accueil</button>
                <button onClick={() => navigate({ name: "groups" })}>Groupes</button>
                <button onClick={() => navigate({ name: "events" })}>Évènements</button>
                <button onClick={() => navigate({ name: "ressources" })}>Ressources</button>
                {isLoggedIn && userId && (
                    <>
                        <button onClick={() => navigate({ name: "dashboard", userId })}>
                            Mon Profil
                        </button>
                        <button onClick={() => navigate({ name: "discussions", userId })}>
                            Mes discussions
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}