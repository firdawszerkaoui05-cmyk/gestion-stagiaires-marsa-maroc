# -*- coding: utf-8 -*-
"""Service principal Flask - Gestion des stagiaires Marsa Maroc."""

import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from models.stagiaire import db
from models.candidature import Candidature
from models.document import Document
from models.notification import Notification

from stagiaire_service import add_stagiaire, get_stagiaires, set_decision

from routes.affectation_routes import affectation_bp
from routes.document_routes import document_bp

from services.fill_official_fiche import fill_official_fiche
from services.ai_assignment.affectation_ia import GenerateurAffectationIA
from services.twilio_service import send_sms


def load_env_file(filepath):
    if not os.path.exists(filepath):
        return

    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()

            if not line or line.startswith("#"):
                continue

            if "=" not in line:
                continue

            key, value = line.split("=", 1)

            key = key.strip()
            value = value.strip().strip('"').strip("'")

            if key and key not in os.environ:
                os.environ[key] = value


load_env_file(os.path.join(os.path.dirname(__file__), ".env"))

app = Flask(__name__)
CORS(app)

# ================= CONFIG DATABASE =================

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///bdd.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():
    db.create_all()

# ================= BLUEPRINTS =================

app.register_blueprint(affectation_bp)
app.register_blueprint(document_bp)

# ================= GET STAGIAIRES =================

@app.route("/stagiaires", methods=["GET"])
def route_get_stagiaires():
    return jsonify(get_stagiaires())

# ================= AJOUT STAGIAIRE =================

@app.route("/stagiaires", methods=["POST"])
def route_ajouter_stagiaire():

    data = request.form or {}
    files = request.files.getlist("files") or []

    errors = {}

    required_fields = [
        "nom",
        "prenom",
        "telephone",
        "email",
        "etablissement",
        "profil_niveau",
        "date_debut",
        "date_fin"
    ]

    for f in required_fields:
        if not data.get(f):
            errors[f] = "Champ requis"

    # Vérification des documents
    if len(files) < 4:
        errors["files"] = (
            "Veuillez joindre les 4 documents requis : "
            "convention, assurance, CIN et demande de stage"
        )

    if errors:
        return jsonify({
            "error": "Validation échouée",
            "errors": errors
        }), 400

    try:
        result = add_stagiaire(data, files)

        return jsonify({
            "message": "Stagiaire ajouté avec succès",
            "stagiaire": result["stagiaire"],
            "scan_report": result["scan_report"],
        }), 201

    except Exception as e:
        return jsonify({
            "error": "Erreur serveur lors du traitement",
            "details": str(e)
        }), 500

# ================= DECISION RH =================

@app.route("/stagiaires/<int:id>/decision", methods=["PUT"])
def route_decision(id):

    data = request.get_json() or {}
    decision = data.get("decision")

    stagiaire = set_decision(id, decision)

    if not stagiaire:
        return jsonify({
            "error": "Stagiaire non trouvé"
        }), 404

    return jsonify({
        "message": "Décision mise à jour",
        "stagiaire": stagiaire
    })

# ================= VALIDATION STAGE =================

@app.route("/valider-stage/<int:id>", methods=["POST"])
def route_valider_stage(id):

    data = request.get_json() or {}

    affectation = (
        data.get("affectation")
        if isinstance(data, dict)
        else None
    )

    stagiaire = None

    for s in get_stagiaires():
        if s["id"] == id:
            stagiaire = s
            break

    if not stagiaire:
        return jsonify({
            "error": "Stagiaire non trouvé"
        }), 404

    # ================= STATUT =================

    stagiaire["decision"] = "Accepté"

    # ================= AFFECTATION IA =================

    if not affectation:

        try:
            affectation = GenerateurAffectationIA.generer_affectation_ia(
                stagiaire.get("profil", ""),
                stagiaire.get("etablissement", "")
            )

        except Exception:

            affectation = {
                "division": "À définir",
                "encadrant": "À définir",
                "theme_stage": "À définir"
            }

    # ================= GENERATION FICHE =================

    filename = f"fiche_finale_{stagiaire['id']}.docx"

    filepath = os.path.join("uploads", filename)

    fill_result = fill_official_fiche(
        stagiaire,
        affectation,
        filepath
    )

    if not fill_result:
        return jsonify({
            "error": "Impossible de générer la fiche d'accueil finale."
        }), 500

    # ================= SMS TWILIO =================

    sms_body = (
        f"Bonjour {stagiaire['prenom']}, "
        f"votre demande de stage est ACCEPTÉE 🎉"
    )

    try:
        send_sms(
            stagiaire.get("telephone"),
            sms_body
        )

    except Exception as e:
        print("Erreur SMS :", str(e))

    # ================= RESPONSE =================

    return jsonify({
        "message": "Stage validé, fiche finale générée et SMS envoyé.",
        "stagiaire": stagiaire,
        "fiche": filename
    })

# ================= PDF DOWNLOAD =================

@app.route("/pdf/<int:id>")
def get_pdf(id):

    for s in get_stagiaires():

        if s["id"] == id:
            return send_from_directory(
                "uploads",
                s["pdf"]
            )

    return jsonify({
        "error": "Document non trouvé"
    }), 404

# ================= WORD DOWNLOAD =================

@app.route("/word/<int:id>")
def get_word(id):

    for s in get_stagiaires():

        if s["id"] == id:
            return send_from_directory(
                "uploads",
                s["word"]
            )

    return jsonify({
        "error": "Document non trouvé"
    }), 404

# ================= FILES =================

@app.route("/uploads/<filename>")
def get_file(filename):
    return send_from_directory("uploads", filename)

# ================= RUN APP =================

if __name__ == "__main__":
    app.run(debug=True)