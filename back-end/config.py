import os

class Config:
    # Substitua pelo caminho do seu banco de dados (Ex: PostgreSQL, MySQL, SQLite)
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///meubanco.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'sua-chave-secreta-aqui')
