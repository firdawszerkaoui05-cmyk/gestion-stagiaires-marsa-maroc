from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Stagiaire(db.Model):
    __tablename__ = 'stagiaires'
    
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(120), nullable=False)
    prenom = db.Column(db.String(120), nullable=False)
    telephone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    etablissement = db.Column(db.String(200), nullable=False)
    profil = db.Column(db.String(150), nullable=False)
    type_stage = db.Column(db.String(100), nullable=False)
    recommande = db.Column(db.String(200), nullable=True)
    pdf = db.Column(db.String(255), nullable=True)
    word = db.Column(db.String(255), nullable=True)
    decision = db.Column(db.String(50), default="En attente")
    division = db.Column(db.String(150), nullable=True)
    theme_stage = db.Column(db.String(200), nullable=True)
    date_creation = db.Column(db.DateTime, default=datetime.utcnow)
    date_modification = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'nom': self.nom,
            'prenom': self.prenom,
            'telephone': self.telephone,
            'email': self.email,
            'etablissement': self.etablissement,
            'profil': self.profil,
            'type_stage': self.type_stage,
            'recommande': self.recommande,
            'pdf': self.pdf,
            'word': self.word,
            'decision': self.decision,
            'division': self.division,
            'theme_stage': self.theme_stage,
            'date_creation': self.date_creation.isoformat() if self.date_creation else None,
            'date_modification': self.date_modification.isoformat() if self.date_modification else None,
        }
