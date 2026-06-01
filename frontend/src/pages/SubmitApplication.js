import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SubmitApplication() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    etablissement: "",
    profil_niveau: "",
    type_stage: "Passage",
    recommande_par: "",
    date_debut: "",
    date_fin: "",
    email: "",
  });

  const [files, setFiles] = useState({
    convention: null,
    assurance: null,
    cin: null,
    demande_stage: null,
  });

  const [errors, setErrors] = useState({});
  const [durationError, setDurationError] = useState("");
  const [loading, setLoading] = useState(false);

  // Références pour les inputs file
  const fileRefs = {
    convention: useRef(null),
    assurance: useRef(null),
    cin: useRef(null),
    demande_stage: useRef(null),
  };
  const [dragOver, setDragOver] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const calculateDuration = (debut, fin) => {
    if (!debut || !fin) return null;
    const start = new Date(debut);
    const end = new Date(fin);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    return { days: diffDays, months: diffMonths };
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    if (newFormData.date_debut && newFormData.date_fin) {
      const duration = calculateDuration(newFormData.date_debut, newFormData.date_fin);
      if (duration && duration.months > 3) {
        setDurationError("❌ La durée du stage ne doit pas dépasser 3 mois");
      } else if (duration && duration.months === 0 && duration.days === 0) {
        setDurationError("❌ Les dates doivent être différentes");
      } else {
        setDurationError("");
      }
    }
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

  const handleDragOver = (e, fileType) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [fileType]: true }));
  };

  const handleDragLeave = (e, fileType) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [fileType]: false }));
  };

  const handleDrop = (e, fileType) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [fileType]: false }));
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [fileType]: "Fichier trop volumineux (max 5MB)" }));
        return;
      }
      setFiles(prev => ({ ...prev, [fileType]: file }));
      setErrors(prev => ({ ...prev, [fileType]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) newErrors.nom = "Nom requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Prénom requis";
    if (!formData.telephone.trim()) newErrors.telephone = "Téléphone requis";
    if (!formData.etablissement.trim()) newErrors.etablissement = "Établissement requis";
    if (!formData.profil_niveau.trim()) newErrors.profil_niveau = "Profil/Niveau requis";
    if (!formData.email.trim()) newErrors.email = "Email requis";
    if (!formData.email.includes("@")) newErrors.email = "Email invalide";
    if (!formData.date_debut) newErrors.date_debut = "Date de début requise";
    if (!formData.date_fin) newErrors.date_fin = "Date de fin requise";

    if (!files.convention) newErrors.convention = "Convention requise";
    if (!files.assurance) newErrors.assurance = "Assurance requise";
    if (!files.cin) newErrors.cin = "CIN requis";
    if (!files.demande_stage) newErrors.demande_stage = "Demande de stage requise";

    if (durationError) newErrors.duration = durationError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formDataObj = new FormData();

      // Ajouter les données texte
      formDataObj.append("nom", formData.nom);
      formDataObj.append("prenom", formData.prenom);
      formDataObj.append("telephone", formData.telephone);
      formDataObj.append("etablissement", formData.etablissement);
      formDataObj.append("profil_niveau", formData.profil_niveau);
      formDataObj.append("type_stage", formData.type_stage);
      formDataObj.append("recommande_par", formData.recommande_par);
      formDataObj.append("date_debut", formData.date_debut);
      formDataObj.append("date_fin", formData.date_fin);
      formDataObj.append("email", formData.email);

      // Ajouter les fichiers
      formDataObj.append("files", files.convention);
      formDataObj.append("files", files.assurance);
      formDataObj.append("files", files.cin);
      formDataObj.append("files", files.demande_stage);

      const response = await fetch("http://127.0.0.1:5000/stagiaires", {
        method: "POST",
        body: formDataObj,
      });

      let result = null;
      try {
        result = await response.json();
      } catch (parseErr) {
        // non-JSON response
      }

      if (response.ok) {
        alert("✅ Candidature soumise avec succès! Scan automatique des documents effectué.");
        navigate("/ma-candidature");
        return;
      }

      // If server returned validation errors, display them next to fields
      if (result && result.errors) {
        const serverErrors = result.errors || {};
        const mapped = {};
        // Map generic 'files' error to individual file inputs
        if (serverErrors.files) {
          mapped.convention = serverErrors.files;
          mapped.assurance = serverErrors.files;
          mapped.cin = serverErrors.files;
          mapped.demande_stage = serverErrors.files;
          delete serverErrors.files;
        }
        // Merge other server errors
        Object.keys(serverErrors).forEach(k => mapped[k] = serverErrors[k]);
        setErrors(prev => ({ ...prev, ...mapped }));
        alert("❌ Validation échouée — vérifiez les champs surlignés.");
        return;
      }

      // Other server-side error
      if (result && result.error) {
        const msg = result.error + (result.details ? `: ${result.details}` : '');
        alert(`❌ ${msg}`);
        return;
      }

      // Fallback
      alert('❌ Erreur lors de la soumission (réponse inattendue du serveur)');
    } catch (error) {
      alert("❌ Erreur: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const duration = formData.date_debut && formData.date_fin 
    ? calculateDuration(formData.date_debut, formData.date_fin)
    : null;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Fiche d'Accueil - Demande de Stage</h1>
          <p style={styles.subtitle}>Marsa Maroc - Système de Gestion des Stagiaires</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* SECTION 1: INFORMATIONS PERSONNELLES */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>📋 Informations Personnelles</h2>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nom *</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  style={{...styles.input, borderColor: errors.nom ? "#e74c3c" : ""}}
                  placeholder="Votre nom"
                />
                {errors.nom && <span style={styles.errorText}>{errors.nom}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  style={{...styles.input, borderColor: errors.prenom ? "#e74c3c" : ""}}
                  placeholder="Votre prénom"
                />
                {errors.prenom && <span style={styles.errorText}>{errors.prenom}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{...styles.input, borderColor: errors.email ? "#e74c3c" : ""}}
                  placeholder="votre.email@example.com"
                />
                {errors.email && <span style={styles.errorText}>{errors.email}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Téléphone *</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  style={{...styles.input, borderColor: errors.telephone ? "#e74c3c" : ""}}
                  placeholder="06 XX XX XX XX"
                />
                {errors.telephone && <span style={styles.errorText}>{errors.telephone}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Établissement *</label>
                <input
                  type="text"
                  name="etablissement"
                  value={formData.etablissement}
                  onChange={handleInputChange}
                  style={{...styles.input, borderColor: errors.etablissement ? "#e74c3c" : ""}}
                  placeholder="Ex: Université Hassan II, ISMONP, etc."
                />
                {errors.etablissement && <span style={styles.errorText}>{errors.etablissement}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Profil et Niveau *</label>
                <input
                  type="text"
                  name="profil_niveau"
                  value={formData.profil_niveau}
                  onChange={handleInputChange}
                  style={{...styles.input, borderColor: errors.profil_niveau ? "#e74c3c" : ""}}
                  placeholder="Ex: Bac+3, Ingénieur, Master, Licence"
                />
                {errors.profil_niveau && <span style={styles.errorText}>{errors.profil_niveau}</span>}
              </div>
            </div>
          </div>

          {/* SECTION 2: INFORMATIONS DE STAGE */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🎓 Informations de Stage</h2>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Type de Stage *</label>
                <select
                  name="type_stage"
                  value={formData.type_stage}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  <option value="Passage">Passage</option>
                  <option value="Alterné">Alterné</option>
                  <option value="Projet de fin d'étude">Projet de fin d'étude</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Recommandé par</label>
                <input
                  type="text"
                  name="recommande_par"
                  value={formData.recommande_par}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Nom de la personne qui vous a recommandé"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Date de Début *</label>
                <input
                  type="date"
                  name="date_debut"
                  value={formData.date_debut}
                  onChange={handleDateChange}
                  style={{...styles.input, borderColor: errors.date_debut ? "#e74c3c" : ""}}
                />
                {errors.date_debut && <span style={styles.errorText}>{errors.date_debut}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Date de Fin *</label>
                <input
                  type="date"
                  name="date_fin"
                  value={formData.date_fin}
                  onChange={handleDateChange}
                  style={{...styles.input, borderColor: errors.date_fin ? "#e74c3c" : ""}}
                />
                {errors.date_fin && <span style={styles.errorText}>{errors.date_fin}</span>}
              </div>
            </div>

            {/* AFFICHAGE DURÉE */}
            {duration && (
              <div style={{...styles.durationBox, borderColor: durationError ? "#e74c3c" : "#2ecc71"}}>
                <span style={{color: durationError ? "#e74c3c" : "#2ecc71", fontWeight: 600}}>
                  {durationError ? "⚠️ " + durationError : `✅ Durée du stage: ${duration.months} mois et ${duration.days % 30} jours`}
                </span>
              </div>
            )}
          </div>

          {/* SECTION 3: DOCUMENTS */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>📄 Documents Requis</h2>

            <div style={styles.documentsGrid}>
              {[
                { key: "convention", label: "Convention de Stage", icon: "📋" },
                { key: "assurance", label: "Attestation d'Assurance", icon: "🛡️" },
                { key: "cin", label: "CIN / Passeport", icon: "🆔" },
                { key: "demande_stage", label: "Demande de Stage", icon: "✉️" },
              ].map((doc) => (
                <div key={doc.key} style={styles.documentCard}>
                  <label style={styles.documentLabel}>
                    {doc.icon} {doc.label} *
                  </label>
                  <div 
                    style={{
                      ...styles.fileDropZone, 
                      borderColor: errors[doc.key] ? "#e74c3c" : (dragOver[doc.key] ? "#2ecc71" : ""),
                      background: dragOver[doc.key] ? "rgba(46, 204, 113, 0.1)" : ""
                    }}
                    onClick={() => handleFileDropClick(doc.key)}
                    onDragOver={(e) => handleDragOver(e, doc.key)}
                    onDragLeave={(e) => handleDragLeave(e, doc.key)}
                    onDrop={(e) => handleDrop(e, doc.key)}
                  >
                    <input
                      ref={fileRefs[doc.key]}
                      type="file"
                      name={doc.key}
                      onChange={handleFileChange}
                      style={styles.fileInput}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <div style={styles.fileDropContent}>
                      <p style={styles.fileDropText}>
                        {files[doc.key] 
                          ? `✅ ${files[doc.key].name}` 
                          : dragOver[doc.key] 
                            ? "📂 Lâchez le fichier ici" 
                            : "Cliquez ou déposez un fichier"
                        }
                      </p>
                      <span style={styles.fileHelp}>PDF, DOC, DOCX, JPG, PNG (Max 5MB)</span>
                    </div>
                  </div>
                  {errors[doc.key] && <span style={styles.errorText}>{errors[doc.key]}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* ERREUR GÉNÉRALE */}
          {durationError && (
            <div style={styles.errorBanner}>
              {durationError}
            </div>
          )}

          {/* BOUTONS */}
          <div style={styles.buttonGroup}>
            <button
              type="submit"
              disabled={loading || durationError !== ""}
              style={{...styles.submitBtn, opacity: loading || durationError !== "" ? 0.6 : 1}}
            >
              {loading ? "Soumission en cours..." : "✅ Soumettre la Candidature"}
            </button>
            <button
              type="reset"
              onClick={() => {
                setFormData({
                  nom: "",
                  prenom: "",
                  telephone: "",
                  etablissement: "",
                  profil_niveau: "",
                  type_stage: "Passage",
                  recommande_par: "",
                  date_debut: "",
                  date_fin: "",
                  email: "",
                });
                setFiles({ convention: null, assurance: null, cin: null, demande_stage: null });
                setErrors({});
                setDurationError("");
                setDragOver({});
              }}
              style={styles.resetBtn}
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 80px)",
    background: "linear-gradient(180deg, #12203a 0%, #0d152c 100%)",
    padding: "40px 24px",
    color: "#eef3ff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: "32px",
    fontWeight: 700,
    margin: "0 0 10px 0",
    color: "#eef3ff",
  },
  subtitle: {
    color: "#b8c5d6",
    fontSize: "14px",
    margin: 0,
  },
  form: {
    display: "grid",
    gap: "30px",
  },
  section: {
    padding: "28px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: 700,
    margin: "0 0 20px 0",
    color: "#e7f0ff",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#e7f0ff",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    fontSize: "14px",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  select: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    fontSize: "14px",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  errorText: {
    color: "#ff7f7f",
    fontSize: "12px",
    fontWeight: 500,
  },
  durationBox: {
    marginTop: "16px",
    padding: "14px 16px",
    borderRadius: "10px",
    border: "2px solid #2ecc71",
    background: "rgba(46, 204, 113, 0.08)",
    fontSize: "14px",
  },
  documentsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  documentCard: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  documentLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#e7f0ff",
  },
  fileDropZone: {
    padding: "20px",
    border: "2px dashed rgba(255,255,255,0.3)",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.03)",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.3s",
  },
  fileInput: {
    display: "none",
  },
  fileDropContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
  },
  fileDropText: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 500,
    color: "#b8c5d6",
  },
  fileHelp: {
    fontSize: "12px",
    color: "#7a8fa6",
  },
  errorBanner: {
    padding: "14px 16px",
    borderRadius: "10px",
    background: "rgba(231, 76, 60, 0.15)",
    border: "1px solid rgba(231, 76, 60, 0.3)",
    color: "#ff7f7f",
    fontWeight: 600,
    textAlign: "center",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginTop: "20px",
  },
  submitBtn: {
    padding: "14px 28px",
    borderRadius: "12px",
    border: "none",
    background: "#2ecc71",
    color: "#0b2c5d",
    fontWeight: 700,
    fontSize: "16px",
    cursor: "pointer",
  },
  resetBtn: {
    padding: "14px 28px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "transparent",
    color: "#e7f0ff",
    fontWeight: 600,
    fontSize: "16px",
    cursor: "pointer",
  },
};
