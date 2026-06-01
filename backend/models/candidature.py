from models.stagiaire import db

class Candidature(db.Model):
    __tablename__ = 'candidatures'

    id = db.Column(db.Integer, primary_key=True)
    domaine_stage = db.Column(db.String(100))
    date_depot = db.Column(db.String(50))
    statut = db.Column(db.String(50))

    stagiaire_id = db.Column(db.Integer, db.ForeignKey('stagiaires.id'))