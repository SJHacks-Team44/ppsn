from flask import Blueprint, request, jsonify
from google.cloud import firestore
from datetime import datetime

policecalls_blueprint = Blueprint('policecalls', __name__)
db = firestore.Client()
collection_ref = db.collection('policecalls')

# 🔵 GET All (with optional filtering + pagination)
@policecalls_blueprint.route('/', methods=['GET'])
def get_all_calls():
    try:
        query = collection_ref

        # Optional filtering by type
        crime_type = request.args.get('type')
        if crime_type:
            query = query.where('type', '==', crime_type)

        # Optional pagination
        limit = int(request.args.get('limit', 50))
        docs = query.limit(limit).stream()

        crimes = []
        for doc in docs:
            data = doc.to_dict()
            crime = {
                'id': doc.id,
                'type': data.get('type'),
                'description': data.get('description'),
                'severity': data.get('severity'),
                'coordinates': [data.get('longitude'), data.get('latitude')],
                'date': data.get('date'),
                'created_at': data.get('created_at'),
                'updated_at': data.get('updated_at')
            }
            crimes.append(crime)

        return jsonify(crimes), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 🔵 GET One by ID
@policecalls_blueprint.route('/<string:doc_id>', methods=['GET'])
def get_call_by_id(doc_id):
    try:
        doc = collection_ref.document(doc_id).get()
        if doc.exists:
            return jsonify(doc.to_dict()), 200
        else:
            return jsonify({'error': 'Crime report not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 🔵 POST Create New Report
@policecalls_blueprint.route('/report', methods=['POST'])
def report_call():
    data = request.json
    required_fields = ['type', 'description', 'severity', 'latitude', 'longitude', 'date']

    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({'error': f"Missing fields: {', '.join(missing_fields)}"}), 400

    try:
        timestamp = datetime.utcnow().isoformat()
        doc_ref = collection_ref.document()
        doc_ref.set({
            'type': data['type'],
            'description': data['description'],
            'severity': data['severity'],
            'latitude': float(data['latitude']),
            'longitude': float(data['longitude']),
            'date': data['date'],
            'created_at': timestamp,
            'updated_at': timestamp
        })
        return jsonify({'message': 'Crime report submitted successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 🔵 PUT Update Report
@policecalls_blueprint.route('/<string:doc_id>', methods=['PUT'])
def update_call(doc_id):
    data = request.json
    try:
        doc_ref = collection_ref.document(doc_id)
        doc = doc_ref.get()

        if not doc.exists:
            return jsonify({'error': 'Crime report not found'}), 404

        update_data = {key: value for key, value in data.items()}
        update_data['updated_at'] = datetime.utcnow().isoformat()

        doc_ref.update(update_data)
        return jsonify({'message': 'Crime report updated successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 🔵 DELETE Report
@policecalls_blueprint.route('/<string:doc_id>', methods=['DELETE'])
def delete_call(doc_id):
    try:
        doc_ref = collection_ref.document(doc_id)
        doc = doc_ref.get()

        if not doc.exists:
            return jsonify({'error': 'Crime report not found'}), 404

        doc_ref.delete()
        return jsonify({'message': 'Crime report deleted successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
