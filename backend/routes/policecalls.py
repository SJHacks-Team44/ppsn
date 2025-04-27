from flask import Blueprint, request, jsonify
from db import get_db_connection

policecalls_blueprint = Blueprint('policecalls', __name__)

@policecalls_blueprint.route('/', methods=['GET'])
def get_all_calls():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id, type, description, severity, latitude, longitude, date FROM policecalls')
    rows = cursor.fetchall()
    conn.close()

    crimes = []
    for row in rows:
        crime = {
            'id': row[0],
            'type': row[1],
            'description': row[2],
            'severity': row[3],
            'coordinates': [row[5], row[4]],  # [lng, lat]
            'date': row[6]
        }
        crimes.append(crime)
    
    return jsonify(crimes)

@policecalls_blueprint.route('/', methods=['POST'])
def report_call():
    data = request.json
    crime_type = data.get('type')
    description = data.get('description')
    severity = data.get('severity')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    date = data.get('date')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO policecalls (type, description, severity, latitude, longitude, date)
        VALUES (%s, %s, %s, %s, %s, %s)
    ''', (crime_type, description, severity, latitude, longitude, date))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Crime report submitted successfully!'}), 201
