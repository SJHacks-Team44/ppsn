from google.cloud import firestore

def get_police_calls(limit=500):
    db = firestore.Client()
    collection_ref = db.collection('policecalls')
    docs = collection_ref.limit(limit).stream()

    calls = []
    for doc in docs:
        data = doc.to_dict()
        calls.append({
            "incident_type": data.get('type'),
            "address": data.get('description'),  # 🔵 Replaced 'address' with 'description' (similar meaning)
            "latitude": data.get('latitude'),
            "longitude": data.get('longitude'),
            "datetime": data.get('date')
        })

    return calls
