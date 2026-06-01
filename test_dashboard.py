#!/usr/bin/env python
"""Test script to verify the complete system"""

import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_api():
    print("=" * 60)
    print("TESTING RH DASHBOARD SYSTEM")
    print("=" * 60)
    
    # Test 1: Get stagiaires
    print("\n[Test 1] GET /stagiaires")
    response = requests.get(f"{BASE_URL}/stagiaires")
    print(f"Status: {response.status_code}")
    stagiaires = response.json()
    print(f"Candidates found: {len(stagiaires)}")
    if len(stagiaires) > 0:
        first = stagiaires[0]
        print(f"  - {first['prenom']} {first['nom']} ({first['email']})")
    
    # Test 2: Get fiche accueil for first stagiaire
    if len(stagiaires) > 0:
        first_id = stagiaires[0]['id']
        print(f"\n[Test 2] GET /api/documents/preview (ID: {first_id})")
        response = requests.get(f"{BASE_URL}/api/documents/preview", params={"stagiaire_id": first_id})
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Document created successfully for {data['stagiaire']['prenom']} {data['stagiaire']['nom']}")
        else:
            print(f"Error: {response.text}")
    
    # Test 3: Update decision
    if len(stagiaires) > 0:
        first_id = stagiaires[0]['id']
        print(f"\n[Test 3] PUT /stagiaires/{first_id}/decision")
        response = requests.put(
            f"{BASE_URL}/stagiaires/{first_id}/decision",
            json={"decision": "Accepté"}
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    
    # Test 4: Verify decision was saved
    print(f"\n[Test 4] GET /stagiaires (after decision)")
    response = requests.get(f"{BASE_URL}/stagiaires")
    stagiaires = response.json()
    if len(stagiaires) > 0:
        first = stagiaires[0]
        print(f"Decision for {first['prenom']} {first['nom']}: {first.get('decision', 'None')}")
    
    print("\n" + "=" * 60)
    print("ALL TESTS COMPLETED")
    print("=" * 60)

if __name__ == "__main__":
    test_api()
