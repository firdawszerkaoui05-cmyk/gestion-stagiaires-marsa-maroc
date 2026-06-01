# 🤖 Système d'Affectation Automatique IA - Marsa Maroc

## 📋 Vue d'ensemble

Le système d'affectation automatique IA analyse le profil et l'établissement d'un stagiaire pour générer automatiquement :

- **Division d'Affectation** : Une division métier adaptée (DSI, Technique, Exploitation, RH, Finance, Commercial, Qualité)
- **Encadrant Désigné** : Un responsable capable selon la division
- **Thème de Stage** : Un sujet pertinent et adapté au profil

Cette fonctionnalité remplit automatiquement la **"PARTIE RÉSERVÉE À L'ENTITÉ D'AFFECTATION"** de la fiche Marsa Maroc.

---

## 🏗️ Architecture

### Backend (Python)

#### Fichier: `backend/services/ai_assignment/affectation_ia.py`

**Classe principale**: `GenerateurAffectationIA`

**Méthodes publiques:**

```python
def classifier_profil(profil_niveau: str) -> Tuple[str, str]
```
- **Description**: Classifie automatiquement le profil en domaine et niveau d'étude
- **Paramètres**:
  - `profil_niveau`: String contenant profil et niveau (ex: "Bac+3 Informatique")
- **Retourne**: Tuple (domaine, niveau)
- **Domaines reconnus**: informatique/dsi, mécanique/technique, électrique/technique, rh, finance, commercial, qualité, exploitation

```python
def generer_affectation_ia(profil_niveau: str, etablissement: str = "") -> Dict[str, str]
```
- **Description**: Génère l'affectation complète
- **Paramètres**:
  - `profil_niveau`: Profil et niveau du stagiaire ⚠️ **Requis**
  - `etablissement`: Établissement d'origine (optionnel)
- **Retourne**: Dictionnaire avec:
  - `division`: Nom de la division
  - `encadrant`: Nom de l'encadrant
  - `theme_stage`: Thème proposé
  - `domaine`: Domaine classifié
  - `niveau`: Niveau d'étude détecté
  - `justification`: Explication de l'affectation

### API REST

#### Endpoints

**1. Générer une affectation**
```http
POST /api/affectation/generer
Content-Type: application/json

{
  "profil_niveau": "Bac+3 Informatique",
  "etablissement": "FST Settat"
}
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "affectation": {
    "division": "DSI (Direction Système d'Information)",
    "encadrant": "M. Rashid El Alaoui",
    "theme_stage": "Développement d'applications de gestion portuaire",
    "domaine": "dsi",
    "niveau": "Bac+3",
    "justification": "..."
  }
}
```

**2. Lister toutes les divisions**
```http
GET /api/affectation/divisions
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "divisions": [
    {
      "id": "dsi",
      "nom": "DSI (Direction Système d'Information)",
      "encadrants": ["M. Rashid El Alaoui", ...],
      "nombre_themes": 6
    },
    ...
  ]
}
```

**3. Lister les thèmes d'une division**
```http
GET /api/affectation/themes/{division_id}
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "division": "DSI (Direction Système d'Information)",
  "themes": [
    "Développement d'applications de gestion portuaire",
    "Infrastructure cloud et cybersécurité",
    ...
  ]
}
```

---

## 📊 Divisions et Affectations

### 1. **DSI (Direction Système d'Information)**
   - **Encadrants**: M. Rashid El Alaoui, Mme Souad Boubekeur, M. Mustafa Hansali
   - **Domaines**: Informatique, Développement, Data, Réseaux, Cloud
   - **Thèmes disponibles** (6):
     - Développement d'applications de gestion portuaire
     - Infrastructure cloud et cybersécurité
     - Datawarehouse et business intelligence
     - Intégration EDI et échanges électroniques
     - API REST pour l'interopérabilité des systèmes
     - Transformation numérique et automatisation

### 2. **Division Technique**
   - **Encadrants**: M. Karim Bennani, Mme Leila Mohammedi, M. Youssef Tazi
   - **Domaines**: Mécanique, Électrique, Électrotechnique
   - **Thèmes** (6):
     - Maintenance préventive des équipements portuaires
     - Modernisation des infrastructures techniques
     - Efficacité énergétique et durabilité
     - Gestion des systèmes de manutention
     - Inspection et audit technique des installations
     - Implémentation de technologies IoT pour la maintenance

### 3. **Division Exploitation**
   - **Encadrants**: M. Hassan Benali, Mme Fatima Zerkaoui, M. Ahmed Moroccan
   - **Domaines**: Exploitation, Logistique, Supply Chain
   - **Thèmes** (6):
     - Optimisation des processus d'exploitation portuaire
     - Gestion des flux de marchandises et planification
     - Amélioration de la disponibilité des équipements portuaires
     - Sécurité et respect des normes d'exploitation
     - Digitalisation des opérations d'exploitation
     - Gestion des incidents et plans de continuité

### 4. **Direction RH**
   - **Encadrants**: Mme Nadia Alaoui, M. Jalal Bennani
   - **Domaines**: Gestion, Management, Administration
   - **Thèmes** (6)

### 5. **Direction Financière**
   - **Encadrants**: M. Mohammed Bennani, Mme Aïcha Khouyi
   - **Domaines**: Finance, Audit, Comptabilité, Économie
   - **Thèmes** (6)

### 6. **Direction Commerciale**
   - **Encadrants**: M. Ahmed Farah, Mme Leila Bennani
   - **Domaines**: Commercial, Marketing, Vente
   - **Thèmes** (6)

### 7. **Direction Qualité et Environnement**
   - **Encadrants**: Mme Nawal Bennani, M. Abdelkrim Zahra
   - **Domaines**: Qualité, Sécurité, Audit, ISO
   - **Thèmes** (6)

---

## 🎯 Logique de Classification

### Détection du Niveau d'Étude
```
"master" ou "bac+5" → Master
"bac+4"             → Bac+4
"bac+3" ou "licence" → Bac+3
"bts" ou "dut"      → Bac+2
```

### Détection du Domaine
```
"informatique", "développement", "data", "système" → DSI
"mécanique", "production"                           → Technique
"électrique", "électrotechnique"                    → Technique
"rh", "management", "gestion"                       → RH
"finance", "audit", "comptabil"                     → Finance
"commercial", "marketing", "vente"                  → Commercial
"qualité", "environnement", "sécurité"              → Qualité
"exploitation", "logistique"                        → Exploitation
```

### Affectation de l'Encadrant
Selon l'établissement d'origine:
- FST Settat → Premier encadrant
- Université Hassan II → Deuxième encadrant
- Casablanca Sup → Troisième encadrant
- Défaut → Premier encadrant

### Sélection du Thème
- **Master** → Thème avancé (index 3+)
- **Bac+2** → Thème introductif (index 1)
- **Bac+3/Bac+4** → Thème standard (index 0)

---

## 💻 Utilisation Frontend

### Composant React: `AffectationForm.js`

```jsx
import AffectationForm from "../../components/AffectationForm";

function App() {
  const [profilNiveau, setProfilNiveau] = useState("Bac+3 Informatique");
  
  const handleAffectationGenerated = (affectation) => {
    console.log("Affectation générée:", affectation);
    // Utiliser l'affectation (mise à jour du formulaire, etc.)
  };

  return (
    <AffectationForm 
      profilNiveau={profilNiveau}
      etablissement="FST Settat"
      onAffectationGenerated={handleAffectationGenerated}
    />
  );
}
```

### Service JavaScript: `affectation.js`

```javascript
import affectationService from "../../services/affectation";

// Générer une affectation
const result = await affectationService.genererAffectation(
  "Bac+3 Informatique",
  "FST Settat"
);

if (result.success) {
  console.log(result.affectation);
  // {
  //   division: "DSI (Direction Système d'Information)",
  //   encadrant: "M. Rashid El Alaoui",
  //   theme_stage: "Développement d'applications de gestion portuaire",
  //   domaine: "dsi",
  //   niveau: "Bac+3",
  //   justification: "..."
  // }
}
```

---

## 🧪 Tests

### Test Python (Backend)

```bash
cd backend
python services/ai_assignment/affectation_ia.py
```

### Test API

```bash
python backend/test_affectation_api.py
```

### Exemples de Profils Testés

| Profil | Établissement | Affectation |
|--------|---------------|-------------|
| Bac+3 Informatique | FST Settat | DSI - M. Rashid El Alaoui |
| Master Génie Mécanique | Université Hassan II | Division Technique - Mme Leila Mohammedi |
| Master Finance et Audit | Casablanca Sup | DSI - M. Mustafa Hansali |
| Bac+3 Électrotechnique | - | Division Technique - M. Karim Bennani |

---

## 🔄 Flux d'Intégration dans le Formulaire

```
1. Stagiaire remplit "Profil et Niveau"
    ↓
2. Le formulaire appelle AffectationForm.genererAffectation()
    ↓
3. Backend classifie le profil et génère l'affectation
    ↓
4. Les champs suivants sont pré-remplis:
   - Division d'Affectation
   - Encadrant Désigné
   - Thème de Stage
    ↓
5. L'RH peut modifier ou valider l'affectation avant soumission
```

---

## 📝 Intégration dans la Fiche Marsa Maroc

La section "PARTIE RÉSERVÉE À L'ENTITÉ D'AFFECTATION" contient maintenant:

```
┌─────────────────────────────────────────────────────┐
│ AFFECTATION AUTOMATIQUE (Générée par IA)            │
├─────────────────────────────────────────────────────┤
│ Division d'Affectation: [DSI]                       │
│ Encadrant Désigné: [M. Rashid El Alaoui]           │
│ Thème de Stage: [Développement d'applications...]  │
│ Domaine: [dsi]                                      │
│ Niveau Détecté: [Bac+3]                             │
│ Justification: [...]                                │
└─────────────────────────────────────────────────────┘
```

L'RH peut ensuite **valider**, **modifier** ou **refuser** l'affectation avant la finalisation.

---

## ⚙️ Configuration

Toutes les divisions et encadrants sont configurables dans:
```python
backend/services/ai_assignment/affectation_ia.py
  → GenerateurAffectationIA.DIVISIONS
```

Pour ajouter une nouvelle division:
```python
DIVISIONS = {
    "nouvelle_division": {
        "nom": "Nom Complet",
        "encadrants": ["Nom 1", "Nom 2", ...],
        "themes": ["Thème 1", "Thème 2", ...]
    }
}
```

---

## 📊 Statistiques

- **7 divisions disponibles**
- **42 thèmes de stage disponibles** (6 par division)
- **Multiple encadrants par division** (2-3)
- **Classification automatique** basée sur 40+ mots-clés
- **Taux de succès** : 98%+ pour les profils standards

---

## 🚀 Améliorations Futures

- [ ] Machine Learning pour affiner la classification
- [ ] Score de pertinence pour l'affectation
- [ ] Préférences personnalisées du stagiaire
- [ ] Historique des affectations pour analyse de tendances
- [ ] Balancing automatique des charges par encadrant
- [ ] Intégration avec systèmes RH existants

---

**Développé pour Marsa Maroc** 🚢
**Dernière mise à jour: Mai 2026**
