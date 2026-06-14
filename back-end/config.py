import os

class Config:
    # Substitua pelo caminho do seu banco de dados (Ex: PostgreSQL, MySQL, SQLite)
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URL', 'postgresql://neondb_owner:npg_4Nngj1YEGcmf@ep-cool-morning-ac0ojm73-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', '197d297435662e2607543964b6fe354eb8dd5002064b49afd86a626c02bd8ebf')

    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }