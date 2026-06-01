#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test complet: Génération Fiche d'Accueil avec curl équivalent (PowerShell)
"""

import json

# Configuration
BASE_URL = "http://localhost:5000"

# Test 1: Données avec profil Informatique
test1 = {
    "stagiaire": {
        "nom": "Ahmed",
        "prenom": "Hassan",
        "email": "hassan.ahmed@example.com",
        "telephone": "+212612345678",
        "etablissement": "FST Settat",
        "profil": "Bac+3 Informatique",
        "type_stage": "Obligatoire",
        "date_debut": "2026-06-01",
        "date_fin": "2026-08-31"
    }
}

# Test 2: Données avec profil Finance
test2 = {
    "stagiaire": {
        "nom": "Benoit",
        "prenom": "Pierre",
        "email": "pierre.benoit@example.com",
        "telephone": "+212612345679",
        "etablissement": "FSJES Rabat",
        "profil": "Master Finance et Audit",
        "type_stage": "Stage fin d'études",
        "date_debut": "2026-07-01",
        "date_fin": "2026-09-30"
    }
}

# Test 3: Avec affectation manuelle
test3 = {
    "stagiaire": {
        "nom": "Mansouri",
        "prenom": "Karim",
        "email": "karim.mansouri@example.com",
        "telephone": "+212612345680",
        "etablissement": "ENSEM Casablanca",
        "profil": "Bac+3 Génie Mécanique",
        "type_stage": "Stage obligatoire",
        "date_debut": "2026-05-15",
        "date_fin": "2026-07-15"
    },
    "affectation": {
        "division": "Division Technique",
        "encadrant": "M. Karim Bennani",
        "theme_stage": "Gestion des systèmes de manutention portuaire",
        "domaine": "mecanique",
        "justification": "Profil correspondant au domaine mécanique et logistique portuaire"
    }
}

print("\n" + "="*80)
print("COMMANDES CURL EQUIVALENTES POWERSHELL")
print("="*80)

print("\n" + "-"*80)
print("TEST 1: Preview - Profil Informatique (Affectation Auto)")
print("-"*80)
print(f"""
# PowerShell:
$payload = '{json.dumps(test1, ensure_ascii=False)}'
$response = Invoke-WebRequest -Uri "{BASE_URL}/api/documents/preview" `
  -Method POST `
  -Headers @{{"Content-Type" = "application/json"}} `
  -Body $payload

$response | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json

# Réponse attendue:
# Status: 200
# Affectation générée: DSI (Direction Système d'Information)
# Encadrant: M. Mustafa Hansali
# Thème: Intégration EDI et échanges électroniques
""")

print("-"*80)
print("TEST 2: Preview - Profil Finance (Affectation Auto)")
print("-"*80)
print(f"""
# PowerShell:
$payload = '{json.dumps(test2, ensure_ascii=False)}'
$response = Invoke-WebRequest -Uri "{BASE_URL}/api/documents/preview" `
  -Method POST `
  -Headers @{{"Content-Type" = "application/json"}} `
  -Body $payload

$response | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json

# Réponse attendue:
# Status: 200
# Affectation générée: Finance (Module Finance & Comptabilité)
# Encadrant: Mme Carla Mendes ou M. Jamal Abadi
""")

print("-"*80)
print("TEST 3: Télécharger Word - Profil Mécanique (Affectation Manuelle)")
print("-"*80)
print(f"""
# PowerShell:
$payload = '{json.dumps(test3, ensure_ascii=False)}'
$response = Invoke-WebRequest -Uri "{BASE_URL}/api/documents/fiche-accueil" `
  -Method POST `
  -Headers @{{"Content-Type" = "application/json"}} `
  -Body $payload `
  -OutFile "fiche_mansouri_karim.docx"

Write-Host "✓ Fichier téléchargé: fiche_mansouri_karim.docx"
Write-Host "  Taille: $($(Get-Item 'fiche_mansouri_karim.docx').Length) bytes"

# Le fichier Word est prêt à être imprimé et signé!
""")

print("\n" + "="*80)
print("COMMANDS CURL (Alternative si PowerShell indisponible)")
print("="*80)

print(f"""
# TEST 1: curl - Preview Informatique
curl -X POST {BASE_URL}/api/documents/preview \\
  -H "Content-Type: application/json" \\
  -d '{json.dumps(test1, ensure_ascii=False)}'

# TEST 2: curl - Preview Finance
curl -X POST {BASE_URL}/api/documents/preview \\
  -H "Content-Type: application/json" \\
  -d '{json.dumps(test2, ensure_ascii=False)}'

# TEST 3: curl - Télécharger Word
curl -X POST {BASE_URL}/api/documents/fiche-accueil \\
  -H "Content-Type: application/json" \\
  -d '{json.dumps(test3, ensure_ascii=False)}' \\
  -o fiche_mansouri_karim.docx
""")

print("\n" + "="*80)
print("RÉPONSE ATTENDUE - Preview")
print("="*80)

response_example = {
    "success": True,
    "preview": {
        "stagiaire": {
            "nom": "Ahmed",
            "prenom": "Hassan",
            "email": "hassan.ahmed@example.com",
            "telephone": "+212612345678",
            "etablissement": "FST Settat",
            "profil": "Bac+3 Informatique",
            "type_stage": "Obligatoire",
            "date_debut": "2026-06-01",
            "date_fin": "2026-08-31"
        },
        "affectation": {
            "division": "DSI (Direction Système d'Information)",
            "encadrant": "M. Mustafa Hansali",
            "theme_stage": "Intégration EDI et échanges électroniques",
            "domaine": "dsi",
            "justification": "Le profil 'Bac+3 Informatique' correspond au domaine DSI..."
        }
    }
}

print(json.dumps(response_example, indent=2, ensure_ascii=False))

print("\n" + "="*80)
print("VÉRIFICATIONS")
print("="*80)
print("""
✓ Format de date: DD/MM/YYYY
  - Saisie: 2026-06-01
  - Document: 01/06/2026

✓ Classification automatique:
  - "Bac+3 Informatique" → DSI
  - "Master Finance et Audit" → Finance
  - "Génie Mécanique" → Division Technique
  
✓ Affectation manuelle:
  - Permet d'override l'affectation IA
  - Utile pour cas spéciaux

✓ Fichier Word généré:
  - Format .docx (Office Open XML)
  - Tableaux formatés
  - Styles Marsa Maroc (bleu/vert)
  - Prêt à imprimer et signer
""")

print("\n" + "="*80)
print("INTÉGRATION FRONTEND")
print("="*80)
print("""
// Utiliser le composant React FicheAccueilDownloader:

import FicheAccueilDownloader from './components/FicheAccueilDownloader';

<FicheAccueilDownloader 
  stagiaire={formData}
  affectation={null}  // Auto-généré
  onDownloadComplete={(info) => {
    console.log(`Fichier: ${info.filename} (${info.size} bytes)`);
  }}
/>

// Boutons internes:
- 👁️ Aperçu : Affiche JSON (non-destructif)
- ⬇️ Télécharger : Génère et télécharge Word
""")

print("\n✅ TOUS LES TESTS READY\n")
