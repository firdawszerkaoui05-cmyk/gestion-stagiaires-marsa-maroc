import requests
import os

# URL de l'API
API_URL = "http://127.0.0.1:5000/stagiaires"

# Données de test pour la candidature
test_data = {
    "nom": "Dupont",
    "prenom": "Jean",
    "telephone": "0612345678",
    "etablissement": "Université Hassan II",
    "profil_niveau": "Bac+3 Informatique",
    "type_stage": "Passage",
    "recommande_par": "Professeur Martin",
    "date_debut": "2026-06-01",
    "date_fin": "2026-08-31",
    "email": "jean.dupont@test.com"
}

# Chemins des fichiers de test
files_paths = {
    "convention": "c:/Users/DELL/Documents/stage-app/backend/uploads/documents/convention/convention_test.pdf",
    "assurance": "c:/Users/DELL/Documents/stage-app/backend/uploads/documents/insurance/assurance_test.pdf",
    "cin": "c:/Users/DELL/Documents/stage-app/backend/uploads/documents/cin/cin_test.pdf",
    "demande_stage": "c:/Users/DELL/Documents/stage-app/backend/uploads/documents/stage_request/demande_stage_test.pdf"
}

def test_candidature_submission():
    print("🚀 Test de soumission de candidature...")

    # Vérifier que les fichiers existent
    for file_type, file_path in files_paths.items():
        if not os.path.exists(file_path):
            print(f"❌ Fichier {file_type} introuvable: {file_path}")
            return
        print(f"✅ Fichier {file_type} trouvé: {file_path}")

    # Créer les fichiers pour le multipart/form-data
    files = []
    for file_type, file_path in files_paths.items():
        try:
            files.append(('files', open(file_path, 'rb')))
            print(f"✅ {file_type} chargé avec succès")
        except Exception as e:
            print(f"❌ Erreur lors du chargement de {file_type}: {e}")
            return

    try:
        # Envoyer la requête POST
        response = requests.post(API_URL, data=test_data, files=files)

        print(f"📡 Statut de la réponse: {response.status_code}")

        if response.status_code == 200:
            print("✅ Candidature soumise avec succès!")
            print("📄 Réponse:", response.json())
        else:
            print("❌ Erreur lors de la soumission:")
            print("📄 Réponse:", response.text)

    except requests.exceptions.RequestException as e:
        print(f"❌ Erreur de connexion: {e}")

    finally:
        # Fermer tous les fichiers
        for _, file_obj in files:
            file_obj.close()

if __name__ == "__main__":
    test_candidature_submission()