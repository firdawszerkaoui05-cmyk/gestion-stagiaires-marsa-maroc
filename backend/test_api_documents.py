#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tests API pour la génération de documents
"""

import requests
import json

BASE_URL = "http://localhost:5000"

print("\n" + "="*70)
print("TESTS API - GÉNÉRATION FICHE D'ACCUEIL")
print("="*70)

# TEST 1: Preview sans affectation
print("\nTEST 1: Preview (aperçu JSON)")
print("-"*70)

payload_simple = {
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

try:
    response = requests.post(f"{BASE_URL}/api/documents/preview", json=payload_simple, timeout=5)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print("Reponse reussie")
        if data.get("preview", {}).get("affectation"):
            aff = data["preview"]["affectation"]
            print(f"  - Division generee: {aff.get('division')}")
            print(f"  - Encadrant: {aff.get('encadrant')}")
            print(f"  - Theme: {aff.get('theme_stage')}")
    else:
        print(f"Erreur: {response.text}")
except Exception as e:
    print(f"Erreur connexion: {str(e)}")
    print("Assurez-vous que le serveur Flask est lance (python app.py)")

# TEST 2: Génération avec affectation complète
print("\nTEST 2: Génération fiche Word avec affectation")
print("-"*70)

payload_with_affectation = {
    "stagiaire": {
        "nom": "Benoit",
        "prenom": "Pierre",
        "email": "pierre@example.com",
        "telephone": "+212612345679",
        "etablissement": "FSJES Rabat",
        "profil": "Master Finance et Audit",
        "type_stage": "Stage Obligatoire",
        "date_debut": "2026-07-01",
        "date_fin": "2026-09-30"
    },
    "affectation": {
        "division": "Finance",
        "encadrant": "Mme Carla Mendes",
        "theme_stage": "Audit interne et conformite",
        "domaine": "finance",
        "justification": "Correspondance parfaite avec le profil Master Finance"
    }
}

try:
    response = requests.post(f"{BASE_URL}/api/documents/fiche-accueil", 
                            json=payload_with_affectation, timeout=5)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        filename = response.headers.get('Content-Disposition', 'document.docx').split('filename=')[1].strip('"')
        print(f"Fichier genere: {filename}")
        print(f"Taille: {len(response.content)} bytes")
        
        # Sauvegarder le fichier
        with open(f"uploads/test_download_{filename}", 'wb') as f:
            f.write(response.content)
        print(f"Fichier telecharge dans uploads/test_download_{filename}")
    else:
        print(f"Erreur: {response.text}")
except Exception as e:
    print(f"Erreur connexion: {str(e)}")

# TEST 3: Génération automatique avec autre profil
print("\nTEST 3: Generation automatique (profil Mecanique)")
print("-"*70)

payload_mecanique = {
    "stagiaire": {
        "nom": "Mansouri",
        "prenom": "Karim",
        "email": "karim@example.com",
        "telephone": "+212612345680",
        "etablissement": "ENSEM Casablanca",
        "profil": "Bac+3 Genie Mecanique",
        "type_stage": "Stage fin d etudes",
        "date_debut": "2026-06-15",
        "date_fin": "2026-09-15"
    }
}

try:
    response = requests.post(f"{BASE_URL}/api/documents/preview", json=payload_mecanique, timeout=5)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        if data.get("preview", {}).get("affectation"):
            aff = data["preview"]["affectation"]
            print("Affectation generee automatiquement:")
            print(f"  - Division: {aff.get('division')}")
            print(f"  - Encadrant: {aff.get('encadrant')}")
            print(f"  - Theme: {aff.get('theme_stage')}")
            print(f"  - Justification: {aff.get('justification')}")
    else:
        print(f"Erreur: {response.text}")
except Exception as e:
    print(f"Erreur connexion: {str(e)}")

print("\n" + "="*70)
print("TESTS COMPLETES")
print("="*70 + "\n")
