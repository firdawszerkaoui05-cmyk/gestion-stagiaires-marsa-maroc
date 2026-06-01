from models.stagiaire import db

class Document(db.Model):
    __tablename__ = 'documents'

    id = db.Column(db.Integer, primary_key=True)
    type_document = db.Column(db.String(100))
    chemin_fichier = db.Column(db.String(255))
    texte_extrait = db.Column(db.Text)

    stagiaire_id = db.Column(db.Integer, db.ForeignKey('stagiaires.id'))