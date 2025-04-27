from db import get_db_connection

def get_police_calls(limit=500):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT incident_type, address, latitude, longitude, datetime
        FROM policecalls
        LIMIT %s
    """, (limit,))
    
    rows = cur.fetchall()
    
    calls = []
    for row in rows:
        calls.append({
            "incident_type": row[0],
            "address": row[1],
            "latitude": row[2],
            "longitude": row[3],
            "datetime": row[4].isoformat() if row[4] else None
        })
    
    cur.close()
    conn.close()
    
    return calls
