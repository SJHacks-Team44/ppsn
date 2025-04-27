import pandas as pd
from google.cloud import firestore

def import_csv(filepath='./data/cleaned_crime_reports.csv'):
    try:
        db = firestore.Client()
        collection_ref = db.collection('policecalls')

        df = pd.read_csv(filepath)

        imported_count = 0
        for _, row in df.iterrows():
            doc_ref = collection_ref.document()
            doc_ref.set({
                'type': row['type'],
                'description': row['description'],
                'severity': row['severity'],
                'latitude': float(row['latitude']),
                'longitude': float(row['longitude']),
                'date': row['date']
            })
            imported_count += 1

        print(f"✅ Imported {imported_count} records into 'policecalls' collection.")
    except Exception as e:
        print(f"❌ Error importing data: {e}")

if __name__ == "__main__":
    import_csv()
