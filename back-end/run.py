from app import create_app, db, socketio

app = create_app()

# Cria as tabelas no banco de dados automaticamente se elas não existirem
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    # O Flask-SocketIO detectará o gevent automaticamente e ativará o suporte real
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
