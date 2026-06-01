# 🚀 Guide d'Intégration - Fiche d'Accueil Automatisée

## Résumé rapide

Vous venez de déployer un système complet de génération **FICHE D'ACCUEIL DES STAGIAIRES** au format Word avec:

✅ Remplissage automatique des données stagiaire  
✅ Intégration IA pour affectation automatique  
✅ Format de date DD/MM/YYYY (conforme Marsa Maroc)  
✅ API REST (aperçu JSON + téléchargement Word)  
✅ Composant React réutilisable  

---

## 📂 Fichiers créés/modifiés

### Backend

| Fichier | Rôle | Status |
|---------|------|--------|
| `backend/services/document_service.py` | Génération Word (python-docx) | ✅ Créé |
| `backend/routes/document_routes.py` | API endpoints | ✅ Créé |
| `backend/app.py` | Enregistrement blueprint | ✅ Modifié |
| `backend/test_document_generation.py` | Tests unitaires | ✅ Créé |
| `backend/test_api_documents.py` | Tests API | ✅ Créé |

### Frontend

| Fichier | Rôle | Status |
|---------|------|--------|
| `frontend/src/components/FicheAccueilDownloader.js` | Composant React | ✅ Créé |

### Documentation

| Fichier | Rôle | Status |
|---------|------|--------|
| `DOCUMENTATION_FICHE_ACCUEIL.md` | Doc complète | ✅ Créé |
| `INTEGRATION_GUIDE.md` | Ce fichier | ✅ Créé |

---

## ⚡ Démarrage rapide

### 1. Vérifier les dépendances

```bash
cd backend
pip install python-docx  # Si pas déjà installé
pip install flask flask-cors requests
```

### 2. Tester localement (sans serveur)

```bash
cd backend
python test_document_generation.py
```

**Résultat attendu:** 5/5 tests ✅

### 3. Tester les API

Terminal 1 - Lancer le serveur:
```bash
cd backend
python app.py
# Le serveur tourne sur http://localhost:5000
```

Terminal 2 - Lancer les tests API:
```bash
cd backend
python test_api_documents.py
```

---

## 🎯 Cas d'usage

### Cas 1: RH valide une candidature et génère la fiche

**Workflow:**
1. RH accède Dashboard.js
2. RH clique "Générer Fiche" pour un candidat
3. Système génère automatiquement l'affectation IA
4. RH télécharge et imprime le Word
5. RH la signe et la transmet au stagiaire

**Code:**
```javascript
import FicheAccueilDownloader from './components/FicheAccueilDownloader';

function Dashboard() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  return (
    <>
      {/* Tableau des candidats */}
      {selectedCandidate && (
        <FicheAccueilDownloader 
          stagiaire={selectedCandidate}
          onDownloadComplete={(info) => {
            console.log(`Fichier téléchargé: ${info.filename}`);
          }}
        />
      )}
    </>
  );
}
```

### Cas 2: Formulaire de candidature auto-génère preview

**Workflow:**
1. Stagiaire remplit SubmitApplication.js
2. Avant de soumettre, il clique "Aperçu Fiche"
3. Système montre aperçu JSON avec affectation IA
4. Stagiaire vérifie les données
5. Stagiaire valide et soumet

**Code:**
```javascript
import FicheAccueilDownloader from './components/FicheAccueilDownloader';

function SubmitApplication() {
  const [formData, setFormData] = useState({...});
  
  return (
    <>
      {/* Formulaire */}
      <FicheAccueilDownloader 
        stagiaire={formData}
        affectation={null}  // Généré automatiquement
      />
    </>
  );
}
```

---

## 🔌 Intégration dans Dashboard.js existant

### Étape 1: Importer le composant

```javascript
// En haut du fichier Dashboard.js
import FicheAccueilDownloader from '../components/FicheAccueilDownloader';
```

### Étape 2: Ajouter state pour stagiaire sélectionné

```javascript
const [selectedStagiaire, setSelectedStagiaire] = useState(null);
```

### Étape 3: Ajouter bouton "Générer Fiche" dans le tableau

```javascript
<button 
  onClick={() => setSelectedStagiaire(stagiaire)}
  style={{
    padding: "5px 10px",
    backgroundColor: "#0066cc",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer"
  }}
>
  📄 Fiche
</button>
```

### Étape 4: Afficher le composant

```javascript
{selectedStagiaire && (
  <div style={{ marginTop: "30px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
    <h3>Fiche d'Accueil pour {selectedStagiaire.prenom} {selectedStagiaire.nom}</h3>
    <FicheAccueilDownloader 
      stagiaire={{
        nom: selectedStagiaire.nom,
        prenom: selectedStagiaire.prenom,
        email: selectedStagiaire.email,
        telephone: selectedStagiaire.telephone,
        etablissement: selectedStagiaire.etablissement || "Non spécifié",
        profil: selectedStagiaire.profil || "Non spécifié",
        type_stage: selectedStagiaire.type_stage || "Non spécifié",
        date_debut: selectedStagiaire.date_debut || "",
        date_fin: selectedStagiaire.date_fin || ""
      }}
      onDownloadComplete={(info) => {
        console.log(`✓ Fiche téléchargée: ${info.filename}`);
        setSelectedStagiaire(null);  // Fermer après téléchargement
      }}
    />
  </div>
)}
```

---

## 📊 API Reference

### Endpoint 1: Preview (Aperçu JSON)

```bash
POST http://localhost:5000/api/documents/preview
Content-Type: application/json

{
  "stagiaire": {
    "nom": "Ahmed",
    "prenom": "Hassan",
    "email": "hassan@example.com",
    "telephone": "+212612345678",
    "etablissement": "FST Settat",
    "profil": "Bac+3 Informatique",
    "type_stage": "Obligatoire",
    "date_debut": "2026-06-01",
    "date_fin": "2026-08-31"
  }
}
```

**Réponse (200):**
```json
{
  "success": true,
  "preview": {
    "stagiaire": { ... },
    "affectation": {
      "division": "DSI",
      "encadrant": "M. Mustafa Hansali",
      "theme_stage": "Intégration EDI et échanges électroniques",
      "domaine": "dsi",
      "justification": "..."
    }
  }
}
```

### Endpoint 2: Téléchargement Word

```bash
POST http://localhost:5000/api/documents/fiche-accueil
Content-Type: application/json

{
  "stagiaire": { ... },
  "affectation": { ... }  // Optionnel
}
```

**Réponse (200):**
```
Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
Content-Disposition: attachment; filename="fiche_accueil_Ahmed_Hassan.docx"
[Fichier binaire]
```

**Erreurs:**
- `400` : Champs manquants dans stagiaire
- `500` : Erreur serveur (python-docx, fichier, etc.)

---

## 🧪 Checklist de test

- [ ] `pip install python-docx` réussi
- [ ] `python test_document_generation.py` → 5/5 ✅
- [ ] `python app.py` lance sans erreur
- [ ] `python test_api_documents.py` → Tous les tests passent
- [ ] Fichier Word généré dans `uploads/`
- [ ] Format dates DD/MM/YYYY dans Word ✓
- [ ] Composant React importe sans erreur
- [ ] Bouton "Aperçu" affiche données JSON
- [ ] Bouton "Télécharger" télécharge .docx

---

## 🛠️ Dépannage

### Erreur: `No module named 'docx'`
```bash
pip install python-docx
```

### Erreur: `Port 5000 already in use`
```bash
python app.py --port 5001
# ou tuer le processus existant
lsof -i :5000  # Trouver le PID
kill -9 <PID>
```

### Dates mal formatées dans Word
→ Vérifier que les dates en entrée sont au format ISO `YYYY-MM-DD`

### Fichier ne se télécharge pas
→ Vérifier que `backend/uploads/` existe et est accessible
```bash
mkdir -p backend/uploads
chmod 755 backend/uploads
```

---

## 📝 Exemple complet d'utilisation

```python
# Backend - Générer et sauvegarder
from services.document_service import save_fiche_accueil
from services.ai_assignment.affectation_ia import GenerateurAffectationIA

stagiaire = {
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean@example.com",
    "telephone": "+212612345678",
    "etablissement": "FST Settat",
    "profil": "Bac+3 Informatique",
    "type_stage": "Obligatoire",
    "date_debut": "2026-06-01",
    "date_fin": "2026-08-31"
}

# Option 1: Générer affectation automatiquement
affectation = GenerateurAffectationIA.generer_affectation_ia(
    stagiaire["profil"],
    stagiaire["etablissement"]
)

# Option 2: Utiliser affectation fournie
affectation = {
    "division": "DSI",
    "encadrant": "M. Rashid El Alaoui",
    "theme_stage": "Développement d'applications",
    "domaine": "dsi",
    "justification": "Correspondance avec le profil Informatique"
}

# Sauvegarder
save_fiche_accueil(stagiaire, affectation, "uploads/fiche_dupont.docx")
print("✓ Fiche générée: uploads/fiche_dupont.docx")
```

---

## 🚀 Prochaines étapes

1. **Intégration Dashboard.js** - Ajouter bouton "Générer Fiche"
2. **Intégration SubmitApplication.js** - Aperçu avant soumission
3. **Signature numérique** - Ajouter signatures RH/Direction
4. **Template personnalisé** - Logo et en-têtes Marsa Maroc
5. **Historique** - Versioning des documents générés

---

## 📞 Support

**Erreurs ou questions?**
1. Vérifier `backend/uploads/` existe
2. Relancer le serveur Flask
3. Consulter `DOCUMENTATION_FICHE_ACCUEIL.md`
4. Vérifier les logs avec `python -c "import docx; print(docx.__version__)"`

---

**Créé:** 05/05/2026  
**Version:** 1.0  
**Status:** Production-Ready ✅
