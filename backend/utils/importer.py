import pandas as pd
import psycopg2
from config import Config

def import_csv():
    conn = psycopg2.connect(
        host=Config.DB_HOST,
        port=Config.DB_PORT,
        dbname=Config.DB_NAME,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD
    )
    cur = conn.cursor()
    
    df = pd.read_csv('./data/policecalls2025.csv')

    # Make sure the table exists
    cur.execute("""
        CREATE TABLE IF NOT EXISTS policecalls (
            id SERIAL PRIMARY KEY,
            incident_type TEXT,
            address TEXT,
            latitude DOUBLE PRECISION,
            longitude DOUBLE PRECISION,
            datetime TIMESTAMP
        );
    """)
    
    # Insert CSV rows
    for _, row in df.iterrows():
        cur.execute("""
            INSERT INTO policecalls (incident_type, address, latitude, longitude, datetime)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            row['incident_type'],
            row['address'],
            row['latitude'],
            row['longitude'],
            row['datetime']
        ))
    
    conn.commit()
    cur.close()
    conn.close()
    print(f"Imported {len(df)} records into policecalls table.")

if __name__ == "__main__":
    import_csv()
