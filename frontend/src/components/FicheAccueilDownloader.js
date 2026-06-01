import React, { useState } from 'react';

const FicheAccueilDownloader = ({ stagiaire, affectation, onDownloadComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  // Affiche un aperçu avant de générer le fichier
  const handlePreview = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:5000/api/documents/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stagiaire: stagiaire,
          affectation: affectation
        })
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Erreur lors de la génération de l'aperçu");
      }
      
      const data = await response.json();
      setPreview(data.preview);
    } catch (err) {
      setError(err.message);
      console.error("Erreur aperçu:", err);
    } finally {
      setLoading(false);
    }
  };

  // Télécharge la fiche officielle Marsa Maroc
  const handleDownloadOfficial = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:5000/api/documents/fiche-officielle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stagiaire: stagiaire,
          affectation: affectation
        })
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Erreur lors de la génération de la fiche officielle");
      }
      
      // Extraire le nom du fichier du header
      const disposition = response.headers.get("content-disposition");
      let filename = "fiche_officielle.docx";
      if (disposition) {
        const matches = disposition.match(/filename="([^"]+)"/);
        if (matches) filename = matches[1];
      }
      
      // Télécharger le blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Callback optionnel
      if (onDownloadComplete) {
        onDownloadComplete({
          filename: filename,
          size: blob.size,
          timestamp: new Date().toISOString()
        });
      }
      
      // Feedback utilisateur
      setError(null);
      alert(`Fiche officielle téléchargée: ${filename}`);
    } catch (err) {
      setError(err.message);
      console.error("Erreur téléchargement fiche officielle:", err);
    } finally {
      setLoading(false);
    }
  };

  // Télécharge le fichier Word généré
  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:5000/api/documents/fiche-accueil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stagiaire: stagiaire,
          affectation: affectation
        })
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Erreur lors de la génération du document");
      }
      
      // Extraire le nom du fichier du header
      const disposition = response.headers.get("content-disposition");
      let filename = "fiche_accueil.docx";
      if (disposition) {
        const matches = disposition.match(/filename="([^"]+)"/);
        if (matches) filename = matches[1];
      }
      
      // Télécharger le blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Callback optionnel
      if (onDownloadComplete) {
        onDownloadComplete({
          filename: filename,
          size: blob.size,
          timestamp: new Date().toISOString()
        });
      }
      
      // Feedback utilisateur
      setError(null);
      alert(`Fichier téléchargé: ${filename}`);
    } catch (err) {
      setError(err.message);
      console.error("Erreur téléchargement:", err);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    marginTop: "20px"
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "10px",
    marginBottom: "15px"
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#006633",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.6 : 1,
    fontSize: "14px",
    fontWeight: "bold"
  };

  const previewStyle = {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "4px",
    marginTop: "15px",
    border: "1px solid #e0e0e0"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
    marginBottom: "15px"
  };

  const thStyle = {
    backgroundColor: "#f0f0f0",
    padding: "8px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    fontWeight: "bold"
  };

  const tdStyle = {
    padding: "8px",
    borderBottom: "1px solid #ddd"
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ marginTop: 0, color: "#006633" }}>
        📄 Fiche d'Accueil des Stagiaires
      </h3>

      <div style={buttonGroupStyle}>
        <button
          onClick={handlePreview}
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? "⏳ Chargement..." : "👁️ Aperçu"}
        </button>

        <button
          onClick={handleDownload}
          disabled={loading || !stagiaire}
          style={{
            ...buttonStyle,
            backgroundColor: loading ? "#999" : "#0066cc"
          }}
        >
          {loading ? "⏳ Génération..." : "⬇️ Télécharger Word"}
        </button>

        <button
          onClick={handleDownloadOfficial}
          disabled={loading || !stagiaire}
          style={{
            ...buttonStyle,
            backgroundColor: loading ? "#999" : "#2e7d32"
          }}
        >
          {loading ? "⏳ Génération..." : "⬇️ Télécharger fiche officielle"}
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: "#ffebee",
          color: "#c62828",
          padding: "10px",
          borderRadius: "4px",
          marginBottom: "10px",
          fontSize: "13px"
        }}>
          ❌ Erreur: {error}
        </div>
      )}

      {preview && (
        <div style={previewStyle}>
          <h4 style={{ marginTop: 0, color: "#006633" }}>Aperçu du document:</h4>

          {preview.stagiaire && (
            <div>
              <h5>Informations Stagiaire:</h5>
              <table style={tableStyle}>
                <tbody>
                  {Object.entries(preview.stagiaire).map(([key, value]) => (
                    <tr key={key}>
                      <td style={{ ...tdStyle, fontWeight: "bold", width: "30%" }}>
                        {key.replace(/_/g, " ").toUpperCase()}
                      </td>
                      <td style={tdStyle}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {preview.affectation && (
            <div>
              <h5>Affectation (IA):</h5>
              <table style={tableStyle}>
                <tbody>
                  {Object.entries(preview.affectation).map(([key, value]) => (
                    <tr key={key}>
                      <td style={{ ...tdStyle, fontWeight: "bold", width: "30%" }}>
                        {key.replace(/_/g, " ").toUpperCase()}
                      </td>
                      <td style={tdStyle}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#e8f5e9",
            borderLeft: "4px solid #4caf50",
            fontSize: "13px"
          }}>
            ✅ Vérifiez les informations ci-dessus, puis cliquez sur "Télécharger Word"
          </div>
        </div>
      )}

      <div style={{
        fontSize: "12px",
        color: "#666",
        marginTop: "10px"
      }}>
        💡 Conseil: Cliquez d'abord sur "Aperçu" pour vérifier les données avant génération.
      </div>
    </div>
  );
};

export default FicheAccueilDownloader;
