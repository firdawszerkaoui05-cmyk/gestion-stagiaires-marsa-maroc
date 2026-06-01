#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Test de la route /valider-stage/<id> sans nécessiter Twilio réel."""

import os
from unittest.mock import patch
from app import app
import stagiaire_service

# Préparer un stagiaire de test
stagiaire_service.stagiaires.clear()
stagiaire_service.stagiaires.append({
    "id": 1,
    "nom": "Test",
    "prenom": "User",
    "email": "test.user@example.com",
    "telephone": "0670000000",
    "etablissement": "FST Settat",
    "profil": "Bac+3 Informatique",
    "type_stage": "Passage",
    "recommande": "Site web",
    "date_debut": "2026-04-01",
    "date_fin": "2026-06-01",
    "decision": "En attente",
    "fichiers": [],
    "pdf": "",
    "word": ""
})

with patch('app.send_sms') as mock_send:
    mock_send.return_value = 'SM123'
    client = app.test_client()
    response = client.post('/valider-stage/1', json={})
    print('Status code:', response.status_code)
    print('JSON:', response.json)
    assert response.status_code == 200
    assert response.json['stagiaire']['decision'] == 'Accepté'
    assert 'fiche' in response.json
    print('Test /valider-stage/1 passé avec succès.')
