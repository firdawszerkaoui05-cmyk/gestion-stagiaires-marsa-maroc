import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={page}>
      <div style={hero}>
        <div style={imageWrapper}>
          <img src="/port.jpg" alt="Bienvenue à Marsa Maroc" style={heroImage} />
          <div style={overlayBox}>
            <div style={overlayText}>SGS - Système de Gestion des Stagiaires</div>
            <p style={overlayParagraph}>
              Bienvenue sur le portail de candidature et de suivi des stages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const page = {
  minHeight: "calc(100vh - 80px)",
  width: "100vw",
  margin: 0,
  padding: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "var(--bg)",
  color: "var(--text)",
  overflowX: "hidden",
};

const hero = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  maxWidth: "100%",
};

const imageWrapper = {
  position: "relative",
  width: "100%",
  minHeight: "calc(100vh - 80px)",
  borderRadius: "0",
  overflow: "hidden",
  boxShadow: "none",
};

const heroImage = {
  width: "100%",
  height: "100%",
  display: "block",
  objectFit: "cover",
};

const overlayBox = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "var(--overlay-bg)",
  border: "1px solid var(--navbar-border)",
  borderRadius: "18px",
  padding: "32px 36px",
  maxWidth: "480px",
  width: "90%",
  textAlign: "center",
};

const overlayText = {
  color: "var(--overlay-text)",
  fontSize: "1.4rem",
  fontWeight: 700,
  lineHeight: 1.3,
  marginBottom: "14px",
};

const overlayParagraph = {
  color: "var(--overlay-subtext)",
  fontSize: "0.98rem",
  lineHeight: 1.6,
  marginBottom: "22px",
};

const actions = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
  marginTop: "24px",
};

const candidateBtn = {
  flex: "1",
  padding: "16px 24px",
  borderRadius: "12px",
  border: "none",
  background: "#2ecc71",
  color: "#0b2c5d",
  fontWeight: 700,
  cursor: "pointer",
};

const dashboardBtn = {
  flex: "1",
  padding: "16px 24px",
  borderRadius: "12px",
  border: "none",
  background: "#3498db",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
};
