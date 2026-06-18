from werkzeug.security import generate_password_hash, check_password_hash
from flask import Blueprint, jsonify, request
from app import db
from app.models.usuario import Usuario, DadosPessoais

transacao_bp = Blueprint('transacao', __name__)

@transacao_bp.route('/MostrarDados', methods=['GET'])
def mostrar_dados():

    dados = DadosPessoais.query.all()
    resultado = []
    for dado in dados:
        resultado.append({
            'id': dado.id,
            'nome': dado.nome,
            'cpf': dado.cpf,
            'rg': dado.rg
        })
    return jsonify(resultado), 200
