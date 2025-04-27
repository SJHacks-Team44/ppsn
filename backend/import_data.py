import pandas as pd
from google.cloud import firestore

def import_csv():
    db = firestore.Client()
    collection_ref = db.collection('policecalls')

    df = pd.read_csv('./data/cleaned_crime_reports.csv')

    # Insert data into Firestore
    for _, row in df.iterrows():
        doc_ref = collection_ref.document()
        doc_ref.set({
            'type': row['type'],
            'description': row['description'],
            'severity': row['severity'],
            'latitude': row['latitude'],
            'longitude': row['longitude'],
            'date': row['date']
        })

    print(f"Imported {len(df)} records into policecalls collection.")

if __name__ == "__main__":
    import_csv()
