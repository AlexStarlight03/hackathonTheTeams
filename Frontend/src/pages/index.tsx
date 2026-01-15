import { useState } from "react";
import {login} from "../services/auth";
import { createProfessionnel } from "../services/professionnel";
import ProfessionnelForm from "../components/ProfessionnelForm";

type Props = {
    isLoggedIn: boolean;
    user? : {prenom: string; professionnel?: boolean; id?: number};
    onLogin: (user: { prenom: string; professionnel?: boolean; id?: number }) => void;
    onLogout: () => void;
    navigate: (page: any) => void;
};

export default function Home({ isLoggedIn, user, onLogin, onLogout, navigate }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [professional, setProfessional] = useState(false);
    const [showQualifInput, setShowQualiInput] = useState(false);

    const handleLogin = async () => {
        setError(null);
        try {
            const userData = await login(email, password);
            if (userData && userData.success) {
                onLogin(userData.user);
            } else {
                setError(userData?.message || "Échec de la connexion. Vérifiez vos identifiants.");
            }
        } catch (err) {
            setError("Erreur lors de la connexion au serveur.");
        }
    };

    const handleRegisterProfessional = async (qualifications: string) => {
        if (!user?.id) return;
        setProfessional(true);
        try {
            const res = await createProfessionnel(user.id, qualifications);
            onLogin(res.user);
            setShowQualiInput(false);
        } catch (err) {
            setError("Erreur lors de la mise à jour du statut professionnel.");
        } finally {
            setProfessional(false);
        }
    };
    return (
        <div className="home-page">
            <section className="intro">
                <h1>Bienvenue sur MindHarbor</h1>
                <p>Une plateforme pour se centrer, faire un suivi personnel et discuter avec les autres!</p>
            </section>

            {!isLoggedIn && (
                <section className="login">
                    <h2>Connectez-vous pour commencer</h2>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                    <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)}/>
                    <button onClick={handleLogin}>Se connecter</button>
                    {error && <p style={{color: "red"}}>{error}</p>}
                    <p>Pas de compte?</p>
                    <button onClick={() => navigate({ name: "register" })}>S'inscrire</button>
                </section>
            )}
            {isLoggedIn && (
                <section className="welcome">
                    <h2>Bienvenue, {user?.prenom}!</h2>
                    <button onClick={onLogout}>Se déconnecter</button>
                    {!user?.professionnel ? (
                        <button onClick={() => setShowQualiInput(true)}>
                            Devenir un professionnel
                        </button>
                    ) : (
                        <div>
                            <p>Vous êtes un profesionnel</p>
                        </div>
                    )}
                 </section>
                )}

            <div className="quicklinks">
                <button onClick={() => navigate({ name: "groups" })}>Voir les groupes</button>
                <button onClick={() => navigate({ name: "events" })}>Voir les évènements</button>
                <button onClick={() => navigate({ name: "ressources" })}>Voir les ressources</button>
                {isLoggedIn && (<button onClick={() => navigate({name: "dashboard"})}>Mon Profil</button>)}
            </div>

            {showQualifInput && (
                <ProfessionnelForm
                    onSubmit={handleRegisterProfessional}
                    onCancel={() => setShowQualiInput(false)}
                    loading={professional}
                />
            )}
        </div>
    );
}
