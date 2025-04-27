from flask import Blueprint, jsonify
from models.police_calls import get_police_calls

policecalls_blueprint = Blueprint('policecalls', __name__)

@policecalls_blueprint.route('/danger-zones', methods=['GET'])
def danger_zones():
    calls = get_police_calls()
    return jsonify(calls)
