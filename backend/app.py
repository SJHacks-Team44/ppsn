from flask import Flask
from flask_cors import CORS
from routes_policecalls import policecalls_blueprint

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register Blueprints
    app.register_blueprint(policecalls_blueprint, url_prefix='/api/policecalls')

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
