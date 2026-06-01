import requests
import json

# Test 1: Profil Informatique
print("=" * 70)
print("TEST 1: Profil Bac+3 Informatique")
print("=" * 70)

data1 = {
    "profil_niveau": "Bac+3 Informatique",
    "etablissement": "FST Settat"
}

response1 = requests.post("http://127.0.0.1:5000/api/affectation/generer", json=data1)
print(json.dumps(response1.json(), indent=2, ensure_ascii=False))

# Test 2: Master Mécanique
print("\n" + "=" * 70)
print("TEST 2: Master Génie Mécanique")
print("=" * 70)

data2 = {
    "profil_niveau": "Master Génie Mécanique",
    "etablissement": "Université Hassan II"
}

response2 = requests.post("http://127.0.0.1:5000/api/affectation/generer", json=data2)
print(json.dumps(response2.json(), indent=2, ensure_ascii=False))

# Test 3: Finance et Audit
print("\n" + "=" * 70)
print("TEST 3: Master Finance et Audit")
print("=" * 70)

data3 = {
    "profil_niveau": "Master Finance et Audit",
    "etablissement": "Casablanca Sup"
}

response3 = requests.post("http://127.0.0.1:5000/api/affectation/generer", json=data3)
print(json.dumps(response3.json(), indent=2, ensure_ascii=False))

# Test 4: Lister les divisions
print("\n" + "=" * 70)
print("TEST 4: Lister toutes les divisions")
print("=" * 70)

response4 = requests.get("http://127.0.0.1:5000/api/affectation/divisions")
divisions = response4.json()
print(json.dumps(divisions, indent=2, ensure_ascii=False))

# Test 5: Thèmes d'une division
print("\n" + "=" * 70)
print("TEST 5: Thèmes de la DSI")
print("=" * 70)

response5 = requests.get("http://127.0.0.1:5000/api/affectation/themes/dsi")
print(json.dumps(response5.json(), indent=2, ensure_ascii=False))
