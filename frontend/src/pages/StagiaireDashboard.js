import { useEffect, useState } from "react";
import { fetchStagiaires } from "../services/api";

export default function StagiaireDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [email, setEmail] = useState("");
  const [stagiaire, setStagiaire] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    const allStagiaires = await fetchStagiaires();
    const found = allStagiaires.find(s => s.email === email);
    
    if (found) {
      setStagiaire(found);
      setAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Email non trouvé. Vérifiez votre email.");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setStagiaire(null);
    setEmail("");
  };

  if (!authenticated) {
    return (
      <div style={page}>
        <div style={content}>
          <h2>Espace Stagiaire</h2>
          <p>Connectez-vous pour consulter votre candidature.</p>

          <form style={loginCard} onSubmit={handleLogin}>
            <label style={label}>Email</label>
            <input
              style={inputStyle}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@example.com"
              required
            />

            {loginError && <div style={errorMsg}>{loginError}</div>}

            <button type="submit" style={loginBtn} disabled={loading}>
              {loading ? "Chargement..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={content}>
        <div style={headerSection}>
          <h2>Ma Candidature</h2>
          <button style={logoutBtn} onClick={handleLogout}>Déconnexion</button>
        </div>

        {stagiaire ? (
          <div style={dashboardContainer}>
            {/* STATUT */}
            <div style={card}>
              <div style={statusHeader}>
                <h3>Statut de la Candidature</h3>
                <span style={{
                  ...statusBadge,
                  background: stagiaire.decision === "Accepté" ? "#2ecc71" : 
                              stagiaire.decision === "Refusé" ? "#e74c3c" : "#f39c12"
                }}>
                  {stagiaire.decision || "En attente"}
                </span>
              </div>
            </div>

            {/* INFORMATIONS PERSONNELLES */}
            <div style={card}>
              <h3 style={cardTitle}>Informations Personnelles</h3>
              <div style={infoGrid}>
                <div>
                  <span style={infoLabel}>Nom</span>
                  <p style={infoValue}>{stagiaire.nom}</p>
                </div>
                <div>
                  <span style={infoLabel}>Prénom</span>
                  <p style={infoValue}>{stagiaire.prenom}</p>
                </div>
                <div>
                  <span style={infoLabel}>Email</span>
                  <p style={infoValue}>{stagiaire.email}</p>
                </div>
                <div>
                  <span style={infoLabel}>Téléphone</span>
                  <p style={infoValue}>{stagiaire.telephone || "-"}</p>
                </div>
              </div>
            </div>

            {/* INFORMATIONS DE STAGE */}
            <div style={card}>
              <h3 style={cardTitle}>Informations de Stage</h3>
              <div style={infoGrid}>
                <div>
                  <span style={infoLabel}>Type de Stage</span>
                  <p style={infoValue}>{stagiaire.type_stage}</p>
                </div>
                <div>
                  <span style={infoLabel}>Filière</span>
                  <p style={infoValue}>{stagiaire.filiere || "-"}</p>
                </div>
                <div>
                  <span style={infoLabel}>Département Affecté</span>
                  <p style={infoValue}>{stagiaire.departement || "En attente d'affectation"}</p>
                </div>
                <div>
                  <span style={infoLabel}>Thème de Stage</span>
                  <p style={infoValue}>{stagiaire.theme_stage || "En attente d'affectation"}</p>
                </div>
              </div>
            </div>

            {/* DOCUMENTS TÉLÉCHARGÉS */}
            <div style={card}>
              <h3 style={cardTitle}>Vos Documents</h3>
              <div style={documentsGrid}>
                <a style={docLink} href={`http://127.0.0.1:5000/pdf/${stagiaire.id}`} target="_blank" rel="noreferrer">
                  📄 Télécharger PDF
                </a>
                <a style={docLink} href={`http://127.0.0.1:5000/word/${stagiaire.id}`} target="_blank" rel="noreferrer">
                  📝 Télécharger Word
                </a>
              </div>
            </div>

            {/* MESSAGE DE DÉCISION */}
            {stagiaire.decision && (
              <div style={{
                ...card,
                background: stagiaire.decision === "Accepté" ? "rgba(46, 204, 113, 0.1)" : "rgba(231, 76, 60, 0.1)",
                border: `2px solid ${stagiaire.decision === "Accepté" ? "#2ecc71" : "#e74c3c"}`
              }}>
                <p style={{color: stagiaire.decision === "Accepté" ? "#2ecc71" : "#e74c3c", fontWeight: 600}}>
                  {stagiaire.decision === "Accepté" 
                    ? "✅ Votre candidature a été ACCEPTÉE. Bienvenue chez Marsa Maroc !" 
                    : "❌ Votre candidature a été REFUSÉE. Merci de votre candidature."}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div style={card}>Chargement...</div>
        )}
      </div>
    </div>
  );
}

const page = {
  minHeight: "calc(100vh - 80px)",
  background: "linear-gradient(180deg, #12203a 0%, #0d152c 100%)",
  padding: "40px 24px",
  color: "#eef3ff",
};

const content = {
  width: "100%",
  maxWidth: "1100px",
  margin: "0 auto",
};

const headerSection = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
};

const logoutBtn = {
  padding: "10px 16px",
  background: "#e74c3c",
  border: "none",
  color: "white",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600,
};

const card = {
  padding: "24px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  marginBottom: "20px",
};

const loginCard = {
  display: "grid",
  gap: "14px",
  padding: "28px",
  background: "rgba(255,255,255,0.08)",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.14)",
  maxWidth: "420px",
};

const label = {
  color: "#e7f0ff",
  fontWeight: 600,
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  boxSizing: "border-box",
};

const loginBtn = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "none",
  background: "#2ecc71",
  color: "#0b2c5d",
  fontWeight: 700,
  cursor: "pointer",
};

const errorMsg = {
  color: "#ff7f7f",
  padding: "10px 12px",
  borderRadius: "10px",
  background: "rgba(255, 127, 127, 0.15)",
};

const dashboardContainer = {
  display: "grid",
  gap: "20px",
};

const statusHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const statusBadge = {
  display: "inline-block",
  padding: "8px 16px",
  borderRadius: "20px",
  color: "white",
  fontWeight: 600,
  fontSize: "14px",
};

const cardTitle = {
  marginTop: 0,
  marginBottom: "20px",
  color: "#e7f0ff",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
};

const infoLabel = {
  display: "block",
  color: "#b8c5d6",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  marginBottom: "6px",
};

const infoValue = {
  margin: 0,
  color: "#eef3ff",
  fontSize: "16px",
  fontWeight: 500,
};

const documentsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "12px",
};

const docLink = {
  display: "block",
  padding: "16px",
  background: "rgba(46, 204, 113, 0.1)",
  border: "2px solid rgba(46, 204, 113, 0.3)",
  borderRadius: "12px",
  color: "#2ecc71",
  textDecoration: "none",
  textAlign: "center",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.3s",
};
