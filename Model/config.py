import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', './files')
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_HOST = os.getenv('DB_HOST')
    DB_PORT = os.getenv('DB_PORT')
    DB_NAME = os.getenv('DB_NAME')
    GROQ_API_KEY = os.getenv('GROQ_API_KEY')
    GENAI_API_KEY = os.getenv('GENAI_API_KEY')

config = Config()
