import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SubmitApplication() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
  });

  const [files, setFiles] = useState({
    convention: null,
    assurance: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Références pour les inputs file
  const fileRefs = {
    convention: useRef(null),
    assurance: useRef(null),
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [name]: "Fichier trop volumineux (max 5MB)" }));
        return;
      }
      setFiles(prev => ({ ...prev, [name]: file }));
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileDropClick = (fileType) => {
    if (fileRefs[fileType] && fileRefs[fileType].current) {
      fileRefs[fileType].current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Formulaire soumis avec succès !");
  };

  return (
    <div style={{ padding: "40px", background: "#12203a", minHeight: "100vh", color: "white" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1>Test Formulaire Documents</h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label>Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "10px", marginTop: "5px" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "10px", marginTop: "5px" }}
            />
          </div>

          {/* DOCUMENTS */}
          <div style={{ marginBottom: "20px" }}>
            <h3>Documents</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {[
                { key: "convention", label: "Convention" },
                { key: "assurance", label: "Assurance" },
              ].map((doc) => (
                <div key={doc.key}>
                  <label>{doc.label}</label>
                  <div
                    style={{
                      padding: "20px",
                      border: "2px dashed #ccc",
                      borderRadius: "10px",
                      textAlign: "center",
                      cursor: "pointer",
                      background: "#f9f9f9"
                    }}
                    onClick={() => handleFileDropClick(doc.key)}
                  >
                    <input
                      ref={fileRefs[doc.key]}
                      type="file"
                      name={doc.key}
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      accept=".pdf,.doc,.docx"
                    />
                    <p>
                      {files[doc.key] ? `✅ ${files[doc.key].name}` : "Cliquez pour sélectionner un fichier"}
                    </p>
                  </div>
                  {errors[doc.key] && <span style={{ color: "red" }}>{errors[doc.key]}</span>}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" style={{ padding: "10px 20px", background: "#2ecc71", color: "white", border: "none" }}>
            Soumettre
          </button>
        </form>
      </div>
    </div>
  );
}