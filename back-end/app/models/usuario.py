from app import db

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    
    id = db.Column(db.Integer, primary_key=True, unique=True)
    nome = db.Column(db.String(255), nullable=False, unique=True)
    senha_hash = db.Column(db.String(120), unique=True, nullable=False)

class DadosPessoais(db.Model):
    __tablename__ = "jovens_aprendizes"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # ID automático
    nome = db.Column(db.String(255), nullable=False)
    cpf = db.Column(db.String(50), nullable=False)
    rg = db.Column(db.String(50), nullable=False)

