from werkzeug.security import generate_password_hash, check_password_hash
from flask import Blueprint, jsonify, request
from app import db
from app.models.usuario import Usuario

auth_bp = Blueprint('usuarios', __name__)

@auth_bp.route('/VerificarUsuario', methods=['POST'])
def verificar_usuario():
    dados = request.get_json()
    id_usuario = dados.get("id")

    if not id_usuario:
        return jsonify({'error': 'Usuario não foi salvo'}), 401

    usuario = Usuario.query.get(id_usuario)

    if not usuario:
        return jsonify({'error': 'Usuario inexistente'}), 401
    else:
        return jsonify({'mensagem': 'Usuario salvo com sucesso!'}), 201


# Rota POST para o React cadastrar um novo usuário
@auth_bp.route('/CadastroUsuario', methods=['POST'])
def criar_usuario():
    dados = request.get_json()

    nome = dados.get("nome")
    senha_limpa = dados.get("senha")

    if not nome or not senha_limpa:
        return jsonify({'error': 'Nenhum nome ou senha foi digitado!'}), 401
    
    usuarios = Usuario.query.filter_by(nome=nome).first()

    if usuarios:
        return jsonify({'error': 'Problema com o nome do usuario!'}), 401
    
    senha_hash = generate_password_hash(senha_limpa)
    
    try:
        novo_usuario = Usuario(nome=nome, senha_hash=senha_hash)
    
        db.session.add(novo_usuario)
        db.session.commit()
        
        return jsonify({
            'id': novo_usuario.id, 
            'nome': nome
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'erro', 'mensagem': str(e)}), 500

@auth_bp.route('/Login', methods=['POST'])
def Login():
    dados = request.get_json()

    nome = dados.get("nome")
    senha_limpa = dados.get("senha")

    if not nome or not senha_limpa:
        return jsonify({'error': 'Nenhum nome ou senha foi digitado'}), 401

    try:
        # 1. Busca o usuário pelo nome exato digitado
        usuario = Usuario.query.filter_by(nome=nome).first()

        # 2. Se o usuário não existir no banco, barra aqui direto
        if not usuario:
            return jsonify({'error': 'Usuario ou senha estão errados!'}), 401

        # 3. Se o usuário existe, valida a senha descriptografando o hash
        if not check_password_hash(usuario.senha_hash, str(senha_limpa)):
            return jsonify({'error': 'Usuario ou senha estão errados!'}), 401
        
        # 4. Login bem-sucedido: Devolve o ID e o Nome para o React salvar no localStorage
        return jsonify({
            'id': usuario.id,
            'nome': usuario.nome,
            'mensagem': 'Login feito com sucesso!'
        }), 201

    except Exception as e:
        db.session.rollback()
        print("ERRO INTERNO NO LOGIN DO FLASK:", str(e))
        return jsonify({'status': 'erro', 'mensagem': str(e)}), 500

