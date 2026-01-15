
type Props = {
    isLoggedIn: boolean;
    user? : {
        prenom: string;
    }
    onLogin: () => void;
    onLogout: () => void;
    navigate: (page: any) => void;
};

export default function Profile({ isLoggedIn, user, onLogin, onLogout, navigate }: Props) {
    return (
        <div className="profile-page">
            <section className="intro">
                <h1>Bienvenue sur MindHarbor</h1>
                <p>Une plateforme pour se centrer, faire un suivi personnel et discuter avec les autres!</p>
            </section>

            {!isLoggedIn && (
                <section className="login">
                    <h2>Connectez-vous pour commencer</h2>
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Mot de passe" />
                    <button onClick={onLogin}>Se connecter</button>
                    <p>Pas de compte?</p>
                    <button onClick={() => navigate({ name: "register" })}>S'inscrire</button>
                </section>
            )}
            {isLoggedIn && (
                <section className="welcome">
                    <h2>Bienvenue, {user?.prenom}!</h2>
                    <button onClick={onLogout}>Se déconnecter</button>
                </section>
            )}
            <div className="quicklinks">
                <button onClick={() => navigate({ name: "groups" })}>Voir les groupes</button>
                <button onClick={() => navigate({ name: "events" })}>Voir les évènements</button>
                <button onClick={() => navigate({ name: "ressources" })}>Voir les ressources</button>
                {isLoggedIn && (<button onClick={() => navigate({name: "dashboard"})}>Mon Profil</button>)}
            </div>
        </div>
    );
}
