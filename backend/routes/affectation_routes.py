"""
Routes API pour l'affectation automatique IA
"""

from flask import Blueprint, request, jsonify
from services.ai_assignment.affectation_ia import generer_affectation_ia

affectation_bp = Blueprint('affectation', __name__, url_prefix='/api/affectation')

@affectation_bp.route('/generer', methods=['POST'])
def generer_affectation():
    """
    Endpoint pour générer automatiquement l'affectation d'un stagiaire
    
    Paramètres JSON requis:
    - profil_niveau: string (ex: "Bac+3 Informatique")
    - etablissement: string (optionnel)
    
    Retour:
    - JSON contenant division, encadrant, theme_stage, etc.
    """
    try:
        data = request.get_json() or {}
        
        profil_niveau = data.get('profil_niveau', '').strip()
        etablissement = data.get('etablissement', '').strip()
        
        if not profil_niveau:
            return jsonify({
                "error": "Le champ 'profil_niveau' est requis"
            }), 400
        
        # Génère l'affectation
        affectation = generer_affectation_ia(profil_niveau, etablissement)
        
        return jsonify({
            "success": True,
            "affectation": affectation
        }), 200
    
    except Exception as e:
        return jsonify({
            "error": f"Erreur lors de la génération: {str(e)}"
        }), 500


@affectation_bp.route('/divisions', methods=['GET'])
def lister_divisions():
    """
    Endpoint pour récupérer la liste de toutes les divisions disponibles
    """
    from services.ai_assignment.affectation_ia import GenerateurAffectationIA
    
    divisions = []
    for key, info in GenerateurAffectationIA.DIVISIONS.items():
        divisions.append({
            "id": key,
            "nom": info["nom"],
            "encadrants": info["encadrants"],
            "nombre_themes": len(info["themes"])
        })
    
    return jsonify({
        "success": True,
        "divisions": divisions
    }), 200


@affectation_bp.route('/themes/<division>', methods=['GET'])
def lister_themes(division):
    """
    Endpoint pour récupérer les thèmes de stage d'une division
    """
    from services.ai_assignment.affectation_ia import GenerateurAffectationIA
    
    division_lower = division.lower()
    
    if division_lower not in GenerateurAffectationIA.DIVISIONS:
        return jsonify({
            "error": f"Division '{division}' non trouvée"
        }), 404
    
    info = GenerateurAffectationIA.DIVISIONS[division_lower]
    
    return jsonify({
        "success": True,
        "division": info["nom"],
        "themes": info["themes"]
    }), 200
