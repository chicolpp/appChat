from werkzeug.security import generate_password_hash, check_password_hash
from flask import Blueprint, jsonify, request
from app import db
from app.models import Usuario

auth_bp = Blueprint('usuarios', __name__)

# Rota GET para o React listar os usuários
@auth_bp.route('/', methods=['GET'])
def listar_usuarios():
    usuarios = Usuario.query.all()

    return jsonify([usuario.to_dict() for usuario in usuarios]), 200

# Rota POST para o React cadastrar um novo usuário
@auth_bp.route('/', methods=['POST'])
def criar_usuario():
    dados = request.get_json()

    nome



    if not dados or 'nome' not in dados or 'email' not in dados:
        return jsonify({"erro": "Dados incompletos"}), 400
        
    novo_usuario = Usuario(nome=dados['nome'], email=dados['email'])
    
    db.session.add(novo_usuario)
    db.session.commit()
    
    return jsonify(novo_usuario.to_dict()), 201
