import { useState, useEffect } from "react";
import affectationService from "../../services/affectation";

export default function AffectationForm({ profilNiveau, etablissement, onAffectationGenerated }) {
  const [affectation, setAffectation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [showDivisions, setShowDivisions] = useState(false);

  // Charge les divisions au montage
  useEffect(() => {
    chargerDivisions();
  }, []);

  const chargerDivisions = async () => {
    const result = await affectationService.listerDivisions();
    if (result.success) {
      setDivisions(result.divisions);
    }
  };

  const genererAffectation = async () => {
    if (!profilNiveau) {
      setError("Veuillez d'abord remplir le profil et niveau");
      return;
    }

    setLoading(true);
    setError("");

    const result = await affectationService.genererAffectation(profilNiveau, etablissement);

    if (result.success) {
      setAffectation(result.affectation);
      setError("");
      if (onAffectationGenerated) {
        onAffectationGenerated(result.affectation);
      }
    } else {
      setError(result.error || "Erreur lors de la génération");
      setAffectation(null);
    }

    setLoading(false);
  };

  if (!profilNiveau) {
    return (
      <div style={styles.warningBox}>
        <p>⚠️ Remplissez d'abord votre profil et niveau pour générer l'affectation</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h3 style={styles.title}>🤖 Générateur d'Affectation IA</h3>
        <p style={styles.subtitle}>Affectation automatique basée sur votre profil</p>

        <button
          onClick={genererAffectation}
          disabled={loading}
          style={{
            ...styles.generateBtn,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "⏳ Génération en cours..." : "⚡ Générer mon affectation"}
        </button>

        {error && <div style={styles.errorBox}>{error}</div>}

        {affectation && (
          <div style={styles.affectationBox}>
            <div style={styles.affectationHeader}>
              <span style={styles.successIcon}>✅</span>
              <span>Affectation Générée</span>
            </div>

            <div style={styles.affectationGrid}>
              <div style={styles.affectationItem}>
                <label style={styles.label}>Division d'Affectation</label>
                <div style={styles.value}>{affectation.division}</div>
              </div>

              <div style={styles.affectationItem}>
                <label style={styles.label}>Encadrant Désigné</label>
                <div style={styles.value}>{affectation.encadrant}</div>
              </div>

              <div style={styles.affectationItem}>
                <label style={styles.label}>Domaine</label>
                <div style={styles.value}>{affectation.domaine}</div>
              </div>

              <div style={styles.affectationItem}>
                <label style={styles.label}>Niveau d'Étude</label>
                <div style={styles.value}>{affectation.niveau}</div>
              </div>

              <div style={{ ...styles.affectationItem, gridColumn: "1 / -1" }}>
                <label style={styles.label}>Thème de Stage</label>
                <div style={styles.themeValue}>{affectation.theme_stage}</div>
              </div>

              <div style={{ ...styles.affectationItem, gridColumn: "1 / -1" }}>
                <label style={styles.label}>Justification</label>
                <div style={styles.justificationValue}>{affectation.justification}</div>
              </div>
            </div>
          </div>
        )}

        <div style={styles.divisionSection}>
          <button
            onClick={() => setShowDivisions(!showDivisions)}
            style={styles.viewDivisionsBtn}
          >
            {showDivisions ? "▼ Masquer" : "▶ Voir"} les divisions disponibles
          </button>

          {showDivisions && divisions.length > 0 && (
            <div style={styles.divisionsGrid}>
              {divisions.map((div) => (
                <div key={div.id} style={styles.divisionCard}>
                  <h4 style={styles.divisionName}>{div.nom}</h4>
                  <p style={styles.divisionInfo}>
                    <strong>Encadrants:</strong> {div.encadrants.length}
                  </p>
                  <p style={styles.divisionInfo}>
                    <strong>Thèmes:</strong> {div.nombre_themes}
                  </p>
                  <button
                    onClick={async () => {
                      const result = await affectationService.listerThemes(div.id);
                      if (result.success) {
                        alert(
                          `Thèmes de ${div.nom}:\n\n${result.themes
                            .map((t, i) => `${i + 1}. ${t}`)
                            .join("\n")}`
                        );
                      }
                    }}
                    style={styles.themesBtn}
                  >
                    Voir les thèmes
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: "30px",
  },
  section: {
    padding: "20px",
    background: "rgba(46, 204, 113, 0.08)",
    border: "2px solid rgba(46, 204, 113, 0.3)",
    borderRadius: "12px",
  },
  title: {
    margin: "0 0 5px 0",
    color: "#2ecc71",
    fontSize: "18px",
    fontWeight: 700,
  },
  subtitle: {
    margin: "0 0 15px 0",
    color: "#b8c5d6",
    fontSize: "13px",
  },
  generateBtn: {
    padding: "12px 20px",
    background: "#2ecc71",
    color: "#0b2c5d",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    marginBottom: "15px",
  },
  errorBox: {
    padding: "12px",
    background: "rgba(231, 76, 60, 0.1)",
    border: "1px solid rgba(231, 76, 60, 0.3)",
    borderRadius: "8px",
    color: "#ff7f7f",
    marginBottom: "15px",
    fontSize: "13px",
  },
  warningBox: {
    padding: "15px",
    background: "rgba(243, 156, 18, 0.1)",
    border: "1px solid rgba(243, 156, 18, 0.3)",
    borderRadius: "8px",
    color: "#f39c12",
  },
  affectationBox: {
    padding: "15px",
    background: "rgba(46, 204, 113, 0.1)",
    border: "2px solid rgba(46, 204, 113, 0.5)",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  affectationHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#2ecc71",
  },
  successIcon: {
    fontSize: "18px",
  },
  affectationGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  affectationItem: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    color: "#b8c5d6",
    letterSpacing: "0.5px",
  },
  value: {
    padding: "8px 10px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "6px",
    color: "#eef3ff",
    fontSize: "13px",
    fontWeight: 500,
  },
  themeValue: {
    padding: "10px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "6px",
    color: "#eef3ff",
    fontSize: "13px",
    fontWeight: 500,
    lineHeight: "1.5",
    minHeight: "40px",
    display: "flex",
    alignItems: "center",
  },
  justificationValue: {
    padding: "10px",
    background: "rgba(46, 204, 113, 0.1)",
    border: "1px solid rgba(46, 204, 113, 0.2)",
    borderRadius: "6px",
    color: "#b8d4ff",
    fontSize: "12px",
    lineHeight: "1.4",
    fontStyle: "italic",
  },
  divisionSection: {
    marginTop: "15px",
  },
  viewDivisionsBtn: {
    padding: "10px 15px",
    background: "rgba(52, 152, 219, 0.2)",
    border: "1px solid rgba(52, 152, 219, 0.4)",
    color: "#3498db",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "12px",
  },
  divisionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "10px",
    marginTop: "15px",
  },
  divisionCard: {
    padding: "12px",
    background: "rgba(52, 152, 219, 0.08)",
    border: "1px solid rgba(52, 152, 219, 0.2)",
    borderRadius: "8px",
  },
  divisionName: {
    margin: "0 0 8px 0",
    fontSize: "12px",
    fontWeight: 700,
    color: "#3498db",
  },
  divisionInfo: {
    margin: "5px 0",
    fontSize: "11px",
    color: "#b8c5d6",
  },
  themesBtn: {
    marginTop: "8px",
    padding: "6px 10px",
    background: "rgba(52, 152, 219, 0.3)",
    border: "1px solid rgba(52, 152, 219, 0.4)",
    color: "#3498db",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 600,
    width: "100%",
  },
};
