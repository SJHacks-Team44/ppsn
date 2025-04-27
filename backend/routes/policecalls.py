from flask import Blueprint, request, jsonify
from google.cloud import firestore

policecalls_blueprint = Blueprint('policecalls', __name__)
db = firestore.Client()
collection_ref = db.collection('policecalls')

@policecalls_blueprint.route('/', methods=['GET'])
def get_all_calls():
    docs = collection_ref.stream()

    crimes = []
    for doc in docs:
        data = doc.to_dict()
        crime = {
            'id': doc.id,
            'type': data.get('type'),
            'description': data.get('description'),
            'severity': data.get('severity'),
            'coordinates': [data.get('longitude'), data.get('latitude')],  # [lng, lat]
            'date': data.get('date')
        }
        crimes.append(crime)

    return jsonify(crimes)

@policecalls_blueprint.route('/report', methods=['POST'])
def report_call():
    data = request.json
    required_fields = ['type', 'description', 'severity', 'latitude', 'longitude', 'date']

    # Basic validation
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        doc_ref = collection_ref.document()
        doc_ref.set(data)
        return jsonify({'message': 'Crime report submitted successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
