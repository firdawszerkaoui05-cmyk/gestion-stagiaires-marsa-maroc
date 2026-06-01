# -*- coding: utf-8 -*-
"""
Routes pour la génération de documents Word avec affectation IA
"""

from flask import Blueprint, request, jsonify, send_file
from services.document_service import save_fiche_accueil
from services.fill_official_fiche import fill_official_fiche
from services.ai_assignment.affectation_ia import GenerateurAffectationIA
import os
import tempfile

document_bp = Blueprint('documents', __name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@document_bp.route("/api/documents/fiche-accueil", methods=["POST"])
def generer_fiche_accueil():
    """
    Génère et retourne une FICHE D'ACCUEIL remplie
    
    Body:
    {
        "stagiaire": {
            "nom": "Dupont",
            "prenom": "Jean",
            "email": "jean@example.com",
            "telephone": "+212612345678",
            "etablissement": "FST Settat",
            "profil": "Bac+3 Informatique",
            "type_stage": "Obligatoire",
            "date_debut": "2026-06-01",
            "date_fin": "2026-08-31"
        },
        "affectation": {...} (optionnel, sinon générée automatiquement)
    }
    
    Response:
    - Code 200 : Fichier Word généré, disponible au téléchargement
    - Code 400 : Données manquantes ou invalides
    - Code 500 : Erreur serveur
    """
    try:
        data = request.get_json()
        
        if not data or "stagiaire" not in data:
            return jsonify({"error": "Données stagiaire manquantes"}), 400
        
        stagiaire = data["stagiaire"]
        affectation = data.get("affectation")
        
        # Valider les champs obligatoires
        required_fields = ["nom", "prenom", "telephone", "etablissement", "profil", "type_stage"]
        missing = [f for f in required_fields if not stagiaire.get(f)]
        
        if missing:
            return jsonify({
                "error": f"Champs manquants : {', '.join(missing)}"
            }), 400
        
        # Générer automatiquement l'affectation si non fournie
        if not affectation:
            try:
                affectation = GenerateurAffectationIA.generer_affectation_ia(
                    stagiaire.get("profil", ""),
                    stagiaire.get("etablissement", "")
                )
            except Exception as e:
                # Si la génération échoue, continuer sans affectation
                affectation = None
        
        # Générer le fichier Word
        filename = f"fiche_accueil_{stagiaire['nom'][:10]}_{stagiaire['prenom'][:10]}.docx"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        save_fiche_accueil(stagiaire, affectation, filepath)
        
        # Retourner le fichier
        return send_file(
            filepath,
            as_attachment=True,
            download_name=filename,
            mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    
    except Exception as e:
        return jsonify({
            "error": f"Erreur lors de la génération du document : {str(e)}"
        }), 500


@document_bp.route("/api/documents/preview", methods=["POST"])
def preview_fiche_accueil():
    """
    Génère une aperçu de la fiche (JSON) sans télécharger le fichier
    Utile pour vérifier les données avant génération
    
    Même body que /api/documents/fiche-accueil
    
    Response: JSON avec les données formatées
    """
    try:
        data = request.get_json()
        
        if not data or "stagiaire" not in data:
            return jsonify({"error": "Données stagiaire manquantes"}), 400
        
        stagiaire = data["stagiaire"]
        affectation = data.get("affectation")
        
        # Générer automatiquement l'affectation si non fournie
        if not affectation:
            try:
                affectation = GenerateurAffectationIA.generer_affectation_ia(
                    stagiaire.get("profil", ""),
                    stagiaire.get("etablissement", "")
                )
            except Exception as e:
                affectation = None
        
        return jsonify({
            "success": True,
            "preview": {
                "stagiaire": stagiaire,
                "affectation": affectation
            }
        }), 200
    
    except Exception as e:
        return jsonify({
            "error": f"Erreur lors de la génération de l'aperçu : {str(e)}"
        }), 500


@document_bp.route("/api/documents/fiche-officielle", methods=["POST"])
def generer_fiche_officielle():
    """
    Remplit et retourne la FICHE OFFICIELLE MARSA MAROC
    Utilise le modèle "FICHE ACCUEIL DES STAGIAIRES DE PASSAGE"
    
    Body:
    {
        "stagiaire": {
            "nom": "Dupont",
            "prenom": "Jean",
            "email": "jean@example.com",
            "telephone": "+212612345678",
            "etablissement": "FST Settat",
            "profil": "Bac+3 Informatique",
            "type_stage": "Passage",
            "date_debut": "2026-06-01",
            "date_fin": "2026-08-31"
        },
        "affectation": {...} (optionnel, sinon générée automatiquement)
    }
    
    Response:
    - Code 200 : Fiche officielle remplie et téléchargeable
    - Code 400 : Données manquantes ou invalides
    - Code 500 : Erreur serveur
    """
    try:
        data = request.get_json()
        
        if not data or "stagiaire" not in data:
            return jsonify({"error": "Données stagiaire manquantes"}), 400
        
        stagiaire = data["stagiaire"]
        affectation = data.get("affectation")
        
        # Valider les champs obligatoires
        required_fields = ["nom", "prenom", "telephone", "etablissement", "profil", "type_stage"]
        missing = [f for f in required_fields if not stagiaire.get(f)]
        
        if missing:
            return jsonify({
                "error": f"Champs manquants : {', '.join(missing)}"
            }), 400
        
        # Générer automatiquement l'affectation si non fournie
        if not affectation:
            try:
                affectation = GenerateurAffectationIA.generer_affectation_ia(
                    stagiaire.get("profil", ""),
                    stagiaire.get("etablissement", "")
                )
            except Exception as e:
                affectation = {
                    "division": "À définir",
                    "encadrant": "À définir",
                    "theme_stage": "À définir"
                }
        
        # Générer le fichier Word avec le modèle officiel
        filename = f"FICHE_OFFICIELLE_{stagiaire['nom']}_{stagiaire['prenom']}.docx"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        # Remplir la fiche officielle
        result = fill_official_fiche(stagiaire, affectation, filepath)
        
        if not result:
            return jsonify({
                "error": "Impossible de remplir la fiche officielle"
            }), 500
        
        # Retourner le fichier
        return send_file(
            filepath,
            as_attachment=True,
            download_name=filename,
            mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    
    except Exception as e:
        return jsonify({
            "error": f"Erreur lors de la génération de la fiche officielle : {str(e)}"
        }), 500

