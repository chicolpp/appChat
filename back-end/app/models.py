from app import db

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    
    id = db.Column(db.Integer, primary_key=True, unique=True)
    nome = db.Column(db.String(80), nullable=False, unique=True)
    senha_hash = db.Column(db.String(120), unique=True, nullable=False)