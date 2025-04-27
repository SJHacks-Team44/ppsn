from flask import Blueprint, jsonify

policecalls_blueprint = Blueprint('policecalls', __name__)

@policecalls_blueprint.route('/danger-zones', methods=['GET'])
def get_danger_zones():
    # Example dummy data for now
    zones = [
        {"id": 1, "latitude": 37.3382, "longitude": -121.8863, "severity": "high", "type": "Robbery", "description": "Robbery reported"},
        {"id": 2, "latitude": 37.3352, "longitude": -121.8811, "severity": "medium", "type": "Theft", "description": "Theft reported"},
        {"id": 3, "latitude": 37.3335, "longitude": -121.8907, "severity": "low", "type": "Assault", "description": "Minor assault"}
    ]
    return jsonify(zones)
