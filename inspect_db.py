#!/usr/bin/env python3
import sqlite3
import json

db_path = "C:\\Jeevanreport2.0\\products.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print("Tables:", tables)

# Check products table
try:
    cursor.execute("PRAGMA table_info(products)")
    schema = cursor.fetchall()
    print("\nProducts table schema:")
    for col in schema:
        print(f"  {col[1]} ({col[2]})")
    
    # Count
    cursor.execute("SELECT COUNT(*) FROM products")
    count = cursor.fetchone()[0]
    print(f"\nTotal products: {count:,}")
    
    # Sample
    print("\nSample product:")
    cursor.execute("SELECT id, barcode, data FROM products LIMIT 1")
    row = cursor.fetchone()
    if row:
        print(f"ID: {row[0]}")
        print(f"Barcode: {row[1]}")
        data = json.loads(row[2])
        print(f"Keys in data: {list(data.keys())[:10]}")
        
except Exception as e:
    print(f"Error: {e}")

conn.close()
