#!/usr/bin/env python3
"""
Migrate products from SQLite to Supabase PostgreSQL
Usage: python migrate_to_supabase.py <SUPABASE_URL> <SUPABASE_KEY>
"""

import sqlite3
import json
import sys
import os
from datetime import datetime

def migrate_products(supabase_url, supabase_key):
    """Migrate products from SQLite to Supabase"""
    
    try:
        import requests
    except ImportError:
        print("Installing requests library...")
        os.system("pip install requests")
        import requests
    
    db_path = "C:\\Jeevanreport2.0\\products.db"
    
    # Connect to local SQLite
    print("Connecting to local database...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get total count
    cursor.execute("SELECT COUNT(*) FROM products")
    total = cursor.fetchone()[0]
    print(f"Found {total:,} products to migrate")
    
    # Fetch all products in batches
    batch_size = 1000
    offset = 0
    success_count = 0
    
    headers = {
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json"
    }
    
    rest_url = f"{supabase_url}/rest/v1"
    
    print(f"\nMigrating to Supabase ({supabase_url})...")
    
    while offset < total:
        cursor.execute(
            """
            SELECT id, barcode, name, brand, category, 
                   trust_score, trust_level, data 
            FROM products 
            ORDER BY id 
            LIMIT ? OFFSET ?
            """,
            (batch_size, offset)
        )
        
        rows = cursor.fetchall()
        if not rows:
            break
        
        # Prepare batch for insert
        batch_data = []
        for row in rows:
            product_data = json.loads(row[7]) if row[7] else {}
            
            batch_data.append({
                "id": row[0],
                "barcode": row[1],
                "name": row[2],
                "brand": row[3],
                "category": row[4],
                "trust_score": row[5],
                "trust_level": row[6],
                "data": product_data
            })
        
        # Insert batch to Supabase
        try:
            response = requests.post(
                f"{rest_url}/products",
                headers=headers,
                json=batch_data,
                timeout=30
            )
            
            if response.status_code in [200, 201]:
                success_count += len(rows)
                print(f"✓ Migrated {success_count:,} / {total:,} products", end='\r')
            else:
                print(f"\n✗ Error batch {offset}: {response.status_code}")
                print(f"  Response: {response.text}")
                
        except Exception as e:
            print(f"\n✗ Error migrating batch at offset {offset}: {e}")
        
        offset += batch_size
    
    conn.close()
    
    print(f"\n✅ Migration complete! Migrated {success_count:,} products")
    return success_count == total

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python migrate_to_supabase.py <SUPABASE_URL> <SUPABASE_KEY>")
        print("\nGet these from Supabase dashboard:")
        print("  1. Go to https://supabase.com")
        print("  2. Create a project")
        print("  3. Go to Settings → API")
        print("  4. Copy Project URL and anon key")
        sys.exit(1)
    
    supabase_url = sys.argv[1]
    supabase_key = sys.argv[2]
    
    success = migrate_products(supabase_url, supabase_key)
    sys.exit(0 if success else 1)
