#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tests pour la génération de documents Word avec affectation IA
"""

import json
import os
import sys
from datetime import datetime, timedelta

# Ajouter le répertoire backend au chemin
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from services.document_service import generate_fiche_accueil, save_fiche_accueil, format_date
from services.ai_assignment.affectation_ia import GenerateurAffectationIA

print("\n" + "="*70)
print("TESTS - GÉNÉRATION FICHE D'ACCUEIL AVEC AFFECTATION IA")
print("="*70)

# ================= TEST 1: Format de date =================
print("\n✓ TEST 1: Format de date (DD/MM/YYYY)")
print("-" * 70)

test_dates = [
    ("2026-06-15", "15/06/2026"),
    ("2026-12-31", "31/12/2026"),
    ("2026-01-01", "01/01/2026"),
    (None, "Non spécifiée"),
    ("", "Non spécifiée"),
]

for input_date, expected in test_dates:
    result = format_date(input_date)
    status = "✓" if result == expected else "✗"
    print(f"{status} format_date('{input_date}') = '{result}' (attendu: '{expected}')")

# ================= TEST 2: Génération sans affectation =================
print("\n✓ TEST 2: Génération fiche sans affectation")
print("-" * 70)

stagiaire_simple = {
    "nom": "Martin",
    "prenom": "Sophie",
    "email": "sophie.martin@example.com",
    "telephone": "+212612345678",
    "etablissement": "FST Settat",
    "profil": "Bac+3 Informatique",
    "type_stage": "Obligatoire",
    "date_debut": "2026-06-01",
    "date_fin": "2026-08-31"
}

try:
    doc = generate_fiche_accueil(stagiaire_simple)
    print("✓ Document généré avec succès")
    print(f"  - Nombre de paragraphes: {len(doc.paragraphs)}")
    print(f"  - Nombre de tableaux: {len(doc.tables)}")
except Exception as e:
    print(f"✗ Erreur: {str(e)}")

# ================= TEST 3: Génération avec affectation =================
print("\n✓ TEST 3: Génération fiche avec affectation IA")
print("-" * 70)

stagiaire_affecte = {
    "nom": "Dubois",
    "prenom": "Jean",
    "email": "jean.dubois@example.com",
    "telephone": "+212612345679",
    "etablissement": "FSJES Casablanca",
    "profil": "Master Finance et Audit",
    "type_stage": "Obligatoire",
    "date_debut": "2026-07-01",
    "date_fin": "2026-09-30"
}

# Générer l'affectation IA
affectation = GenerateurAffectationIA.generer_affectation_ia(
    stagiaire_affecte["profil"],
    stagiaire_affecte["etablissement"]
)

print(f"Affectation générée:")
print(f"  - Division: {affectation['division']}")
print(f"  - Encadrant: {affectation['encadrant']}")
print(f"  - Thème: {affectation['theme_stage']}")
print(f"  - Domaine: {affectation['domaine']}")

try:
    doc = generate_fiche_accueil(stagiaire_affecte, affectation)
    print("\n✓ Document généré avec affectation avec succès")
    print(f"  - Nombre de paragraphes: {len(doc.paragraphs)}")
    print(f"  - Nombre de tableaux: {len(doc.tables)}")
except Exception as e:
    print(f"✗ Erreur: {str(e)}")

# ================= TEST 4: Sauvegarde du fichier =================
print("\n✓ TEST 4: Sauvegarde du fichier Word")
print("-" * 70)

try:
    os.makedirs("uploads", exist_ok=True)
    filepath = "uploads/test_fiche_accueil.docx"
    
    save_fiche_accueil(stagiaire_affecte, affectation, filepath)
    
    if os.path.exists(filepath):
        file_size = os.path.getsize(filepath)
        print(f"✓ Fichier sauvegardé: {filepath}")
        print(f"  - Taille: {file_size} bytes")
    else:
        print(f"✗ Le fichier n'a pas été créé")
except Exception as e:
    print(f"✗ Erreur: {str(e)}")

# ================= TEST 5: Dates formatées =================
print("\n✓ TEST 5: Vérification des formats de date dans le document")
print("-" * 70)

stagiaire_dates = {
    "nom": "Benoit",
    "prenom": "Pierre",
    "email": "pierre.benoit@example.com",
    "telephone": "+212612345680",
    "etablissement": "IGA Meknès",
    "profil": "Bac+3 Génie Agricole",
    "type_stage": "Stage de Fin d'Études",
    "date_debut": "2026-05-15",
    "date_fin": "2026-07-15"
}

try:
    doc = generate_fiche_accueil(stagiaire_dates)
    
    # Vérifier que les dates formatées sont présentes
    doc_text = "\n".join([p.text for p in doc.paragraphs])
    
    if "15/05/2026" in doc_text:
        print("✓ Date de début formatée correctement: 15/05/2026")
    else:
        print("✗ Date de début non trouvée au bon format")
    
    if "15/07/2026" in doc_text:
        print("✓ Date de fin formatée correctement: 15/07/2026")
    else:
        print("✗ Date de fin non trouvée au bon format")
        
except Exception as e:
    print(f"✗ Erreur: {str(e)}")

print("\n" + "="*70)
print("✅ TOUS LES TESTS COMPLÉTÉS")
print("="*70 + "\n")
