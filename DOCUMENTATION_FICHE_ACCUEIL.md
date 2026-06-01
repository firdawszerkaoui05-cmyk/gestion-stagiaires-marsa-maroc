# Documentation - Génération Automatique de FICHE D'ACCUEIL

## 📋 Vue d'ensemble

Le système génère automatiquement des **FICHES D'ACCUEIL DES STAGIAIRES** au format Word (.docx) avec :
- **Données du stagiaire** : Nom, Prénom, Email, Téléphone, Établissement, Profil, Type de stage
- **Affectation IA** : Division, Encadrant, Thème, Domaine  
- **Périodes** : Format DD/MM/YYYY (Du... Au...)
- **Formatage professionnel** : En-têtes, tableaux, styles Marsa Maroc

---

## 🏗️ Architecture

### Structure des fichiers

```
backend/
├── services/
│   └── document_service.py          # Génération documents (python-docx)
├── routes/
│   └── document_routes.py           # Endpoints API
├── app.py                            # Enregistrement blueprints
└── test_api_documents.py            # Tests API
```

### Dépendances

```
python-docx >= 0.8.11   # Génération documents Word
Flask >= 2.0.0
requests >= 2.25.0
```

---

## 🔧 Composants principaux

### 1. Service de document (`document_service.py`)

#### `format_date(date_str)`
Convertit une date au format DD/MM/YYYY

**Exemple:**
```python
format_date("2026-06-15")  # Retourne: "15/06/2026"
format_date("2026-12-31")  # Retourne: "31/12/2026"
format_date(None)          # Retourne: "Non spécifiée"
```

#### `generate_fiche_accueil(stagiaire, affectation=None)`
Crée un Document Word avec toutes les sections

**Paramètres:**
```python
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

affectation = {
    "division": "DSI",
    "encadrant": "M. Rashid El Alaoui",
    "theme_stage": "Développement d'applications",
    "domaine": "dsi",
    "justification": "Correspondance parfaite avec le profil"
}

doc = generate_fiche_accueil(stagiaire, affectation)
```

**Retour:** Document object (python-docx)

#### `save_fiche_accueil(stagiaire, affectation, filepath)`
Génère et sauvegarde le fichier Word

```python
save_fiche_accueil(stagiaire, affectation, "uploads/fiche_dupont.docx")
# Crée le fichier à: uploads/fiche_dupont.docx
```

---

## 📡 Endpoints API

### 1. POST `/api/documents/preview`

**Génère un aperçu JSON** (sans télécharger le fichier)

**Request:**
```json
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
  },
  "affectation": { ... }  // OPTIONNEL
}
```

**Response (200):**
```json
{
  "success": true,
  "preview": {
    "stagiaire": { ... },
    "affectation": {
      "division": "DSI",
      "encadrant": "M. Mustafa Hansali",
      "theme_stage": "Intégration EDI",
      "domaine": "dsi",
      "justification": "..."
    }
  }
}
```

**Cas d'usage:** Vérifier les données avant génération du fichier

---

### 2. POST `/api/documents/fiche-accueil`

**Génère et retourne le fichier Word**

**Request:** Même format que `/api/documents/preview`

**Response (200):**
```
Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
Content-Disposition: attachment; filename="fiche_accueil_Ahmed_Hassan.docx"
[Contenu binaire du fichier Word]
```

**Codes d'erreur:**
- `400` : Données manquantes ou invalides
- `500` : Erreur serveur

---

## 📝 Format du document Word

### Section 1: ENTÊTE
```
═══════════════════════════════════════════════════════════════════
             FICHE D'ACCUEIL DES STAGIAIRES
                    Marsa Maroc
═══════════════════════════════════════════════════════════════════
```

### Section 2: INFORMATIONS DU STAGIAIRE
```
┌─────────────────────────┬─────────────────────────┐
│ Champ                   │ Valeur                  │
├─────────────────────────┼─────────────────────────┤
│ Nom                     │ Dupont                  │
│ Prénom                  │ Jean                    │
│ Email                   │ jean@example.com        │
│ Téléphone               │ +212612345678           │
│ Établissement           │ FST Settat              │
│ Profil / Niveau         │ Bac+3 Informatique      │
│ Type de stage           │ Obligatoire             │
└─────────────────────────┴─────────────────────────┘

Période de stage : Du 01/06/2026 Au 31/08/2026
```

### Section 3: AFFECTATION À L'ENTITÉ D'ACCUEIL (SI APPLICABLE)
```
┌─────────────────────────┬─────────────────────────┐
│ Élément                 │ Détail                  │
├─────────────────────────┼─────────────────────────┤
│ Division                │ DSI                     │
│ Encadrant               │ M. Rashid El Alaoui     │
│ Thème de stage          │ Développement...        │
│ Domaine                 │ dsi                     │
└─────────────────────────┴─────────────────────────┘

Justification de l'affectation : 
Correspondance parfaite avec le profil académique...
```

### Section 4: REMARQUES ET NOTES
```
Remarques et notes :
_________________________________________________________________
[Espace pour notes manuscrites]
```

### Pied de page
```
Document généré le 05/05/2026 à 14:32
```

---

## 🧪 Tests

### Test local (sans serveur Flask)

```bash
cd backend
python test_document_generation.py
```

**Résultat attendu:**
```
✓ TEST 1: Format de date (DD/MM/YYYY)
  ✓ format_date('2026-06-15') = '15/06/2026' (attendu: '15/06/2026')
  
✓ TEST 2: Génération fiche sans affectation
  ✓ Document généré avec succès
  - Nombre de paragraphes: 14
  - Nombre de tableaux: 1
  
✓ TEST 3: Génération fiche avec affectation IA
  Affectation générée:
  - Division: DSI
  - Encadrant: M. Mustafa Hansali
  ✓ Document généré avec affectation avec succès
  
✓ TEST 4: Sauvegarde du fichier Word
  ✓ Fichier sauvegardé: uploads/test_fiche_accueil.docx
  - Taille: 37425 bytes
  
✓ TEST 5: Vérification des formats de date
  ✓ Date de début formatée correctement: 15/05/2026
```

### Test API (avec serveur Flask)

```bash
# Terminal 1: Lancer le serveur
cd backend
python app.py

# Terminal 2: Lancer les tests
cd backend
python test_api_documents.py
```

---

## 💻 Utilisation

### Exemple 1: Générer une fiche avec affectation automatique

```python
import requests

payload = {
    "stagiaire": {
        "nom": "Martin",
        "prenom": "Sophie",
        "email": "sophie@example.com",
        "telephone": "+212612345678",
        "etablissement": "FST Settat",
        "profil": "Bac+3 Informatique",  # IA détecte → DSI
        "type_stage": "Obligatoire",
        "date_debut": "2026-06-01",
        "date_fin": "2026-08-31"
    }
    # affectation OMISE → Générée automatiquement
}

response = requests.post("http://localhost:5000/api/documents/fiche-accueil", 
                        json=payload)

if response.status_code == 200:
    with open("fiche_martin.docx", "wb") as f:
        f.write(response.content)
    print("Fichier téléchargé: fiche_martin.docx")
```

### Exemple 2: Vérifier avant génération

```python
response = requests.post("http://localhost:5000/api/documents/preview", 
                        json=payload)

data = response.json()
affectation = data["preview"]["affectation"]
print(f"Division: {affectation['division']}")
print(f"Encadrant: {affectation['encadrant']}")
print(f"Thème: {affectation['theme_stage']}")

# Si OK → Générer le fichier
# Si NON → Modifier manuellement l'affectation
```

### Exemple 3: Frontend React

```javascript
// SubmitApplication.js
const handleGenerateFiche = async () => {
    const payload = {
        stagiaire: formData,
        affectation: affectationData  // Optionnel
    };
    
    try {
        const response = await fetch("http://localhost:5000/api/documents/fiche-accueil", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "fiche_accueil.docx";
            a.click();
        }
    } catch (error) {
        console.error("Erreur:", error);
    }
};
```

---

## 🔄 Intégration dans le workflow

### Étape 1: Stagiaire remplit formulaire
- SubmitApplication.js collecte nom, prénom, profil, etc.

### Étape 2: RH valide la candidature
- Dashboard.js affiche la candidature
- RH clique "Générer Fiche"

### Étape 3: Système génère document
- IA classifie le profil → Affectation
- python-docx crée la fiche Word
- Fichier téléchargé au format DD/MM/YYYY

### Étape 4: Fiche d'accueil signée
- RH imprime et signe le document
- Transmet au stagiaire
- Stagiaire valide et retourne signé

---

## 📊 Formats de date

Le système assure cohérence **DD/MM/YYYY** partout :

```
Date saisie (Frontend)  : 2026-06-15 (ISO)
Date stockée (Backend)  : 2026-06-15 (ISO)
Date affichée (Document): 15/06/2026 (DD/MM/YYYY)
```

**Conversion automatique:**
```python
format_date("2026-06-15")       # → "15/06/2026"
format_date("2026-12-31")       # → "31/12/2026"
format_date("2026-01-05")       # → "05/01/2026"
```

---

## 🚀 Améliorations futures

- [ ] Template personnalisé avec logo Marsa Maroc
- [ ] Signatures numérisées (RH + Direction)
- [ ] Génération PDF directe
- [ ] Champs supplémentaires (salaire, horaires, lieu)
- [ ] Rappels automatiques (dates de signature)
- [ ] Versioning des documents (v1, v2, etc.)

---

## ⚙️ Configuration

**Dossier uploads:**
```bash
backend/uploads/           # Tous les fichiers générés
├── fiche_dupont_jean.docx
├── fiche_martin_sophie.docx
└── test_fiche_accueil.docx
```

**Permissions:**
```
Lecture/Écriture requises pour backend/uploads/
```

---

## ❌ Troubleshooting

| Problème | Solution |
|----------|----------|
| Import error: `docx` | `pip install python-docx` |
| Port 5000 occupied | `python app.py --port 5001` |
| Fichier non téléchargé | Vérifier Content-Disposition header |
| Dates mal formatées | Vérifier format ISO entrant (YYYY-MM-DD) |
| Dossier uploads inexistant | `mkdir backend/uploads` |

---

**Document mis à jour:** 05/05/2026  
**Version:** 1.0
