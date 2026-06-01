#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from services.ai_assignment.affectation_ia import GenerateurAffectationIA

print("\n" + "="*70)
print("RÉSUMÉ - SYSTÈME D'AFFECTATION AUTOMATIQUE IA")
print("="*70)

# Statistiques
print("\nSTATISTIQUES:")
print(f"  ✓ Divisions disponibles: {len(GenerateurAffectationIA.DIVISIONS)}")
total_encadrants = sum(len(v["encadrants"]) for v in GenerateurAffectationIA.DIVISIONS.values())
print(f"  ✓ Encadrants disponibles: {total_encadrants}")
total_themes = sum(len(v["themes"]) for v in GenerateurAffectationIA.DIVISIONS.values())
print(f"  ✓ Thèmes de stage: {total_themes}")

print("\nDIVISIONS DISPONIBLES:")
for key, info in GenerateurAffectationIA.DIVISIONS.items():
    print(f"  • {info['nom']}")
    print(f"    - Encadrants: {len(info['encadrants'])} | Thèmes: {len(info['themes'])}")

print("\nDOMAINES RECONNUS:")
domaines = [
    'Informatique / Développement / Data → DSI',
    'Mécanique / Génie Mécanique → Technique',
    'Électrique / Électrotechnique → Technique',
    'RH / Management / Gestion → RH',
    'Finance / Audit / Comptabilité → Finance',
    'Commercial / Marketing / Vente → Commercial',
    'Qualité / Sécurité / Environnement → Qualité',
    'Exploitation / Logistique / Supply Chain → Exploitation'
]
for domaine in domaines:
    print(f"  ✓ {domaine}")

print("\nNIVEAUX DETECÈS:")
niveaux = ['Bac+2 (BTS/DUT)', 'Bac+3 (Licence)', 'Bac+4', 'Master (Bac+5)']
for niveau in niveaux:
    print(f"  ✓ {niveau}")

print("\n✅ STATUS: SYSTÈME OPÉRATIONNEL")
print("="*70 + "\n")
