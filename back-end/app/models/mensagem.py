from app import db # Ou de onde você importa o seu "db"
from datetime import datetime

class MensagemChat(db.Model):
    __tablename__ = 'mensagens_chat'

    id = db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(80), nullable=False)
    texto = db.Column(db.Text, nullable=False)
    data_envio = db.Column(db.DateTime, default=datetime.utcnow)

    # ESTA FUNÇÃO PRECISA EXISTIR EXATAMENTE ASSIM:
    def to_dict(self):
        return {
            'id': self.id,
            'usuario': self.usuario,
            'texto': self.texto,
            # Se tiver data, converte para texto, senão deixa None
            'data_envio': self.data_envio.isoformat() if self.data_envio else None
        }
