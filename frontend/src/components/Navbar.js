import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navLink = (active) => ({
    color: active ? "#fff" : "#cdddf5",
    padding: "10px 18px",
    textDecoration: "none",
    borderRadius: "8px",
    background: active ? "#1a3760" : "transparent",
    marginRight: "10px",
  });

  return (
    <div style={navbar}>
      <Link to="/" style={brandContainer}>
        <img src="/logo.png" alt="SGS logo" style={logoStyle} />
        <div style={brand}>SGS</div>
      </Link>

      <div style={linkGroup}>
        <Link style={navLink(location.pathname === "/")} to="/">
          Accueil
        </Link>
        <Link style={navLink(location.pathname === "/candidature")} to="/candidature">
          Déposer une demande
        </Link>
        <Link style={navLink(location.pathname === "/ma-candidature")} to="/ma-candidature">
          Suivre mon dossier
        </Link>
        <Link style={navLink(location.pathname === "/dashboard")} to="/dashboard">
          Espace RH
        </Link>
      </div>
    </div>
  );
}

const navbar = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "18px 24px",
  background: "rgba(11, 44, 93, 0.95)",
  position: "sticky",
  top: 0,
  zIndex: 10,
};

const brandContainer = {
  display: "flex",
  alignItems: "center",
};

const logoStyle = {
  width: "42px",
  height: "42px",
  objectFit: "contain",
  marginRight: "12px",
};

const brand = {
  color: "#fff",
  fontWeight: 700,
};

const linkGroup = {
  display: "flex",
  alignItems: "center",
};
