from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import mysql  # Importamos MySQL desde extensions

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Permitir CORS solo desde el frontend

    mysql.init_app(app)  # Inicializamos MySQL

    # Importamos las rutas dentro de la función para evitar el import circular
    from routes import productos_bp
    app.register_blueprint(productos_bp)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
