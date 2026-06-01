# Guide de test - Génération Fiche d'Accueil

## COMMANDES POWERSHELL

### Test 1: Aperçu (Preview) - Profil Informatique

```powershell
$payload = @{
    stagiaire = @{
        nom = "Ahmed"
        prenom = "Hassan"
        email = "hassan.ahmed@example.com"
        telephone = "+212612345678"
        etablissement = "FST Settat"
        profil = "Bac+3 Informatique"
        type_stage = "Obligatoire"
        date_debut = "2026-06-01"
        date_fin = "2026-08-31"
    }
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/documents/preview" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $payload

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Reponse attendue:**
- Status 200
- Affectation generee: DSI
- Encadrant: M. Mustafa Hansali

---

### Test 2: Aperçu - Profil Finance

```powershell
$payload = @{
    stagiaire = @{
        nom = "Benoit"
        prenom = "Pierre"
        email = "pierre.benoit@example.com"
        telephone = "+212612345679"
        etablissement = "FSJES Rabat"
        profil = "Master Finance et Audit"
        type_stage = "Stage fin d'etudes"
        date_debut = "2026-07-01"
        date_fin = "2026-09-30"
    }
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/documents/preview" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $payload

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Reponse attendue:**
- Status 200
- Affectation generee: Finance
- Encadrant: Mme Carla Mendes

---

### Test 3: Télécharger Word - Profil Mécanique

```powershell
$payload = @{
    stagiaire = @{
        nom = "Mansouri"
        prenom = "Karim"
        email = "karim.mansouri@example.com"
        telephone = "+212612345680"
        etablissement = "ENSEM Casablanca"
        profil = "Bac+3 Genie Mecanique"
        type_stage = "Stage obligatoire"
        date_debut = "2026-05-15"
        date_fin = "2026-07-15"
    }
    affectation = @{
        division = "Division Technique"
        encadrant = "M. Karim Bennani"
        theme_stage = "Gestion des systemes de manutention"
        domaine = "mecanique"
        justification = "Profil correspondant au domaine mecanique"
    }
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/documents/fiche-accueil" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $payload `
  -OutFile "fiche_mansouri_karim.docx"

Write-Host "Fichier telecharge: fiche_mansouri_karim.docx"
Get-Item "fiche_mansouri_karim.docx" | Select-Object Name, Length
```

---

## COMMANDES CURL (Alternative)

```bash
# Test 1: Preview - Informatique
curl -X POST http://localhost:5000/api/documents/preview \
  -H "Content-Type: application/json" \
  -d '{
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
  }'

# Test 2: Preview - Finance
curl -X POST http://localhost:5000/api/documents/preview \
  -H "Content-Type: application/json" \
  -d '{
    "stagiaire": {
      "nom": "Benoit",
      "prenom": "Pierre",
      "email": "pierre@example.com",
      "telephone": "+212612345679",
      "etablissement": "FSJES Rabat",
      "profil": "Master Finance et Audit",
      "type_stage": "Stage fin d'\''etudes",
      "date_debut": "2026-07-01",
      "date_fin": "2026-09-30"
    }
  }'

# Test 3: Telecharger Word
curl -X POST http://localhost:5000/api/documents/fiche-accueil \
  -H "Content-Type: application/json" \
  -d '{
    "stagiaire": {
      "nom": "Mansouri",
      "prenom": "Karim",
      "email": "karim@example.com",
      "telephone": "+212612345680",
      "etablissement": "ENSEM Casablanca",
      "profil": "Bac+3 Genie Mecanique",
      "type_stage": "Stage obligatoire",
      "date_debut": "2026-05-15",
      "date_fin": "2026-07-15"
    }
  }' -o fiche_mansouri.docx
```

---

## Éxecuter les tests

### 1. Tester sans serveur (Unitaires)
```bash
cd backend
python test_document_generation.py
```

### 2. Tester avec serveur (API)

Terminal 1:
```bash
cd backend
python app.py
```

Terminal 2:
```bash
cd backend
python test_api_documents.py
```

---

## Verifications

- Date format: 01/06/2026 (DD/MM/YYYY) ✓
- Affectation auto: Bac+3 Info → DSI ✓
- Fichier Word: 37KB+, .docx format ✓
- Tableaux formatés: 2 par fiche ✓
- Styles Marsa Maroc: Bleu/Vert ✓

---

**Version:** 1.0
**Date:** 05/05/2026
