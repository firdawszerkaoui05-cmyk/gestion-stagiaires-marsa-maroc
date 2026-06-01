#!/usr/bin/env python
"""Test la nouvelle route de la fiche officielle"""

import requests
import json

stagiaire = {
    'nom': 'Zerkaoui',
    'prenom': 'Firdaws',
    'email': 'zerkaouifirdaws533@gmail.com',
    'telephone': '0674182136',
    'etablissement': 'FST Settat',
    'profil': 'Bac+3 Informatique',
    'type_stage': 'Passage',
    'date_debut': '2026-04-01',
    'date_fin': '2026-06-01'
}

print('=' * 70)
print('TEST FICHE OFFICIELLE MARSA MAROC')
print('=' * 70)

print('\n[TEST] Génération fiche officielle remplie...')
response = requests.post(
    'http://127.0.0.1:5000/api/documents/fiche-officielle',
    json={'stagiaire': stagiaire, 'affectation': None}
)

print(f'Status: {response.status_code}')
if response.status_code == 200:
    filename = response.headers.get('content-disposition', '').split('filename=')[1].strip('"') if 'filename=' in response.headers.get('content-disposition', '') else 'fiche_officielle.docx'
    size = len(response.content)
    print(f'✓ Fiche officielle générée avec succès!')
    print(f'  Nom: {filename}')
    print(f'  Taille: {size} bytes')
    
    # Sauvegarder pour vérification
    with open(f'uploads/{filename}', 'wb') as f:
        f.write(response.content)
    print(f'  Sauvegardé dans: uploads/{filename}')
else:
    print(f'✗ Erreur: {response.text}')

print('\n' + '=' * 70)
