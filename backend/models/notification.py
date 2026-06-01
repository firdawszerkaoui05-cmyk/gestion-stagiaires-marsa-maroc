from models.stagiaire import db

class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.Text)
    statut_envoi = db.Column(db.String(50))
    date_envoi = db.Column(db.String(50))

    stagiaire_id = db.Column(db.Integer, db.ForeignKey('stagiaires.id'))