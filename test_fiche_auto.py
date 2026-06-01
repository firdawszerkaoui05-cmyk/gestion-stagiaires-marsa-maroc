#!/usr/bin/env python
"""Test la génération automatique de la fiche"""

import requests
import json

stagiaire = {
    'nom': 'Zerkaoui',
    'prenom': 'Firdaws',
    'email': 'zerkaouifirdaws533@gmail.com',
    'telephone': '0674182136',
    'etablissement': 'FST Settat',
    'profil': 'Bac+3 Informatique',
    'type_stage': 'Projet de fin d\'études',
    'date_debut': '2026-04-01',
    'date_fin': '2026-06-01'
}

print('=' * 70)
print('TEST GÉNÉRATION AUTOMATIQUE DE FICHE')
print('=' * 70)

print('\n[1] Test Aperçu (Preview)')
print('-' * 70)
response = requests.post(
    'http://127.0.0.1:5000/api/documents/preview',
    json={'stagiaire': stagiaire, 'affectation': None}
)

print(f'Status: {response.status_code}')
if response.status_code == 200:
    data = response.json()
    print('✓ Aperçu généré avec succès!')
    print('\nDonnées Stagiaire:')
    print(json.dumps(data['preview']['stagiaire'], indent=2, ensure_ascii=False))
    print('\nAffectation IA générée automatiquement:')
    print(json.dumps(data['preview']['affectation'], indent=2, ensure_ascii=False))
else:
    print(f'✗ Erreur: {response.text}')

print('\n[2] Test Téléchargement Word')
print('-' * 70)
response = requests.post(
    'http://127.0.0.1:5000/api/documents/fiche-accueil',
    json={'stagiaire': stagiaire, 'affectation': None}
)

print(f'Status: {response.status_code}')
if response.status_code == 200:
    filename = response.headers.get('content-disposition', '').split('filename=')[1].strip('"') if 'filename=' in response.headers.get('content-disposition', '') else 'fiche_accueil.docx'
    size = len(response.content)
    print(f'✓ Fichier Word généré avec succès!')
    print(f'  Nom: {filename}')
    print(f'  Taille: {size} bytes')
    
    # Sauvegarder le fichier de test
    with open(f'uploads/{filename}', 'wb') as f:
        f.write(response.content)
    print(f'  Sauvegardé dans: uploads/{filename}')
else:
    print(f'✗ Erreur: {response.text}')

print('\n' + '=' * 70)
print('TESTS COMPLÉTÉS')
print('=' * 70)
