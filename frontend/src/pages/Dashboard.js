import { useEffect, useState } from "react";
import { fetchStagiaires, updateDecision, validateStage } from "../services/api";
import FicheAccueilDownloader from "../components/FicheAccueilDownloader";

export default function Dashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [stagiaires, setStagiaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStagiaire, setSelectedStagiaire] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchStagiaires();
    setStagiaires(data);
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [authenticated]);

  const handleLogin = (event) => {
    event.preventDefault();
    if (username === "rh" && password === "stage123") {
      setAuthenticated(true);
      setLoginError("");
      return;
    }
    setLoginError("Identifiants incorrects. Utilisez rh / stage123.");
  };

  const handleDecision = async (id, decision) => {
    if (decision === "Accepté") {
      await validateStage(id);
    } else {
      await updateDecision(id, decision);
    }
    loadData();
  };

  // Styles objets
  const page = {
    minHeight: "calc(100vh - 80px)",
    background: "linear-gradient(180deg, #12203a 0%, #0d152c 100%)",
    padding: "40px 24px",
    color: "#eef3ff",
  };

  const content = {
    width: "100%",
    maxWidth: "1100px",
  };

  const card = {
    padding: "24px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
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

  const tableWrapper = {
    overflowX: "auto",
    marginTop: "20px",
  };

  const table = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "820px",
    background: "rgba(255,255,255,0.08)",
  };

  const actionsCell = {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  };

  const acceptBtn = {
    background: "#2ecc71",
    border: "none",
    color: "#0b2c5d",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  };

  const rejectBtn = {
    background: "#e74c3c",
    border: "none",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  };

  const viewFicheBtn = {
    background: "#0066cc",
    border: "none",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const fichePanel = {
    marginTop: "40px",
    padding: "30px",
    background: "rgba(255,255,255,0.08)",
    border: "2px solid #0066cc",
    borderRadius: "12px",
    maxWidth: "900px",
  };

  const fichePanelHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
  };

  const closeBtn = {
    background: "#e74c3c",
    border: "none",
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const decisionPanel = {
    marginTop: "30px",
    padding: "20px",
    background: "rgba(46, 204, 113, 0.1)",
    border: "1px solid rgba(46, 204, 113, 0.3)",
    borderRadius: "10px",
  };

  const decisionButtons = {
    display: "flex",
    gap: "15px",
    marginTop: "15px",
  };

  const acceptBtnLarge = {
    flex: 1,
    padding: "14px 20px",
    background: "#2ecc71",
    border: "none",
    color: "#0b2c5d",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "16px",
  };

  const rejectBtnLarge = {
    flex: 1,
    padding: "14px 20px",
    background: "#e74c3c",
    border: "none",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "16px",
  };

  if (!authenticated) {
    return (
      <div style={page}>
        <div style={content}>
          <h2>Connexion RH</h2>
          <p>Identifiez-vous pour accéder au tableau RH.</p>

          <form style={loginCard} onSubmit={handleLogin}>
            <label style={label}>Nom d'utilisateur</label>
            <input
              style={inputStyle}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="rh"
            />

            <label style={label}>Mot de passe</label>
            <input
              style={inputStyle}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="stage123"
            />

            {loginError && <div style={errorMsg}>{loginError}</div>}

            <button type="submit" style={loginBtn}>Se connecter</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={content}>
        <h2>Dashboard RH</h2>
        <p>Liste des candidatures reçues et décisions de validation.</p>

        {loading ? (
          <div style={card}>Chargement...</div>
        ) : (
          <div style={tableWrapper}>
            {stagiaires.length === 0 ? (
              <div style={card}>Aucune candidature pour le moment.</div>
            ) : (
              <table style={table}>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Stage</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stagiaires.map((stagiaire) => (
                    <tr key={stagiaire.id}>
                      <td>{stagiaire.nom} {stagiaire.prenom}</td>
                      <td>{stagiaire.email}</td>
                      <td>{stagiaire.type_stage}</td>
                      <td>{stagiaire.decision}</td>
                      <td style={actionsCell}>
                        <button 
                          style={viewFicheBtn} 
                          onClick={() => setSelectedStagiaire(stagiaire)}
                        >
                          📄 Voir fiche
                        </button>
                        <button style={acceptBtn} onClick={() => handleDecision(stagiaire.id, "Accepté")}>✓ Accepté</button>
                        <button style={rejectBtn} onClick={() => handleDecision(stagiaire.id, "Refusé")}>✗ Refusé</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Panneau Fiche remplie */}
        {selectedStagiaire && (
          <div style={fichePanel}>
            <div style={fichePanelHeader}>
              <h3 style={{ margin: 0 }}>
                Fiche d'accueil - {selectedStagiaire.prenom} {selectedStagiaire.nom}
              </h3>
              <button 
                style={closeBtn}
                onClick={() => setSelectedStagiaire(null)}
              >
                ✕ Fermer
              </button>
            </div>
            
            <FicheAccueilDownloader
              stagiaire={{
                nom: selectedStagiaire.nom,
                prenom: selectedStagiaire.prenom,
                email: selectedStagiaire.email,
                telephone: selectedStagiaire.telephone || "Non spécifié",
                etablissement: selectedStagiaire.etablissement || "Non spécifié",
                profil: selectedStagiaire.profil || "Non spécifié",
                type_stage: selectedStagiaire.type_stage || "Non spécifié",
                date_debut: selectedStagiaire.date_debut || "",
                date_fin: selectedStagiaire.date_fin || ""
              }}
              affectation={null}
              onDownloadComplete={(info) => {
                console.log(`Fichier téléchargé: ${info.filename}`);
              }}
            />

            <div style={decisionPanel}>
              <h4>Décision RH:</h4>
              <div style={decisionButtons}>
                <button 
                  style={acceptBtnLarge} 
                  onClick={() => {
                    handleDecision(selectedStagiaire.id, "Accepté");
                    setSelectedStagiaire(null);
                  }}
                >
                  ✓ Accepter le candidat
                </button>
                <button 
                  style={rejectBtnLarge} 
                  onClick={() => {
                    handleDecision(selectedStagiaire.id, "Refusé");
                    setSelectedStagiaire(null);
                  }}
                >
                  ✗ Refuser le candidat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
