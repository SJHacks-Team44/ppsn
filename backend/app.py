from flask import Flask
from flask_cors import CORS
from routes.policecalls import policecalls_blueprint

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(policecalls_blueprint, url_prefix='/api/policecalls')

if __name__ == "__main__":
    app.run(debug=True)
