import { useState } from "react";
import { register } from "../services/auth";
import "../styles/auth.css";

interface RegisterPageProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

export default function RegisterPage({ onRegisterSuccess, onNavigateToLogin }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.nom.trim()) {
      setError("Le nom est requis");
      return;
    }
    if (!formData.prenom.trim()) {
      setError("Le prénom est requis");
      return;
    }
    if (!formData.email.trim()) {
      setError("L'email est requis");
      return;
    }
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      await register(
        formData.nom,
        formData.prenom,
        formData.email,
        formData.password
      );
      
      // Inscription réussie
      setSuccess(true);
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirection vers la page de connexion après 2 secondes
      setTimeout(() => {
        onRegisterSuccess();
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "L'inscription a échoué"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Inscription</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Inscription réussie ! Redirection...</div>}

        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Votre nom"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prenom">Prénom</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Votre prénom"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 caractères"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Répétez votre mot de passe"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? "Inscription en cours..." : "S'inscrire"}
            </button>
          </form>
        )}

        <div className="auth-link">
          <p>
            Vous avez déjà un compte ?{" "}
            <button
              onClick={onNavigateToLogin}
              className="link-button"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
