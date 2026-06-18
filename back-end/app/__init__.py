from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from config import Config
from datetime import datetime

db = SQLAlchemy()

socketio = SocketIO(
    cors_allowed_origins="*", 
    async_mode='gevent',
    ping_timeout=60,
    ping_interval=25,
    logger=True, 
    engineio_logger=True
)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    db.init_app(app)
    socketio.init_app(app)

    with app.app_context():
        try:
            from app.models.mensagem import MensagemChat
            db.create_all()
        except Exception as e:
            print("Aviso na checagem do banco:", str(e))

    import app.routes.rotasAutenticacao as rotas
    if hasattr(rotas, 'auth_bp'):
        app.register_blueprint(rotas.auth_bp, url_prefix='/usuarios')
    elif hasattr(rotas, 'usuarios_bp'):
        app.register_blueprint(rotas.usuarios_bp, url_prefix='/usuarios')

    return app

@socketio.on('enviar_mensagem')
def handle_mensagem_global(dados):
    agora_iso = datetime.utcnow().isoformat() + 'Z'
    dados['data_envio'] = agora_iso

    try:
        from app.models.mensagem import MensagemChat
        nova_msg = MensagemChat(usuario=dados['usuario'], texto=dados['texto'])
        db.session.add(nova_msg)
        db.session.commit()
    except Exception as e:
        if 'db' in globals() and db.session:
            db.session.rollback()
        print("Aviso: Falha ao salvar mensagem, mas transmitindo em tempo real:", str(e))
        
    emit('receber_mensagem', dados, broadcast=True)

@socketio.on('pedir_historico')
def handle_pedir_historico():
    try:
        from app.models.mensagem import MensagemChat
        from flask import current_app
        
        with current_app.app_context():
            mensagens = MensagemChat.query.order_by(MensagemChat.id.asc()).limit(50).all()
            
            lista_mensagens = []
            for m in mensagens:
                msg_data = getattr(m, 'data_envio', None)
                if isinstance(msg_data, datetime):
                    msg_data_iso = msg_data.isoformat() + 'Z'
                else:
                    msg_data_iso = datetime.utcnow().isoformat() + 'Z'

                lista_mensagens.append({
                    'id': getattr(m, 'id', None),
                    'usuario': getattr(m, 'usuario', ''),
                    'texto': getattr(m, 'texto', ''),
                    'data_envio': msg_data_iso
                })
            
            emit('enviar_historico', lista_mensagens, broadcast=False)
    except Exception as e:
        print("Erro interno ao ler histórico via socket:", str(e))

# 🛠️ NOVO EVENTO: Deleta todas as mensagens da tabela e dispara o comando de limpeza geral
@socketio.on('limpar_historico')
def handle_limpar_historico():
    try:
        from app.models.mensagem import MensagemChat
        from flask import current_app
        
        with current_app.app_context():
            # Executa o comando DELETE em todas as linhas da tabela mensagens_chat
            db.session.query(MensagemChat).delete()
            db.session.commit()
            print("🗑️ Banco de dados limpo por solicitação do usuário.")
            
        # Avisa TODOS os computadores conectados para zerarem o array de mensagens na tela
        emit('historico_limpo', broadcast=True)
    except Exception as e:
        if 'db' in globals() and db.session:
            db.session.rollback()
        print("Erro ao tentar limpar o histórico do banco:", str(e))
