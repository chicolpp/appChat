from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

# Inicializa as extensões sem associá-las a um app ainda
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # 🚀 MODIFICAÇÃO AQUI: Mudamos de "http://localhost:5173" para "*"
    # Isso garante que o Flask responda ao React tanto no PC quanto no iPhone via Tailscale
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Inicializa o banco de dados no app
    db.init_app(app)

    # Registro de Blueprints (as rotas organizadas por arquivos)
    from app.routes.rotasAutenticacao import auth_bp
   

    app.register_blueprint(auth_bp, url_prefix='/api/usuarios')

    return app
