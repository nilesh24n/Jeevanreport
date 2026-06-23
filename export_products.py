#!/usr/bin/env python3
"""
Export products from SQLite to JSON API format
This creates a searchable JSON index for deployment
"""

import sqlite3
import json
import os
from pathlib import Path

def export_products_sample():
    """Export first 5000 products and create search index"""
    db_path = "C:\\Jeevanreport2.0\\products.db"
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get first 5000 products for immediate deployment
    print("Exporting products...")
    cursor.execute("""
        SELECT id, barcode, name, brand, category, 
               trust_score, trust_level, data 
        FROM products 
        ORDER BY trust_score DESC
        LIMIT 5000
    """)
    
    products = []
    search_index = {}
    
    for row in cursor.fetchall():
        product_data = json.loads(row[7]) if row[7] else {}
        
        product = {
            "id": row[0],
            "barcode": row[1],
            "name": row[2],
            "brand": row[3],
            "category": row[4],
            "trust_score": row[5],
            "trust_level": row[6],
            "data": product_data
        }
        
        products.append(product)
        
        # Create search index
        key = f"{row[2]}_{row[3]}".lower().replace(" ", "-")
        search_index[key] = row[0]
    
    # Save to public folder for deployment
    output_dir = "C:\\Jeevanreport2.0\\public\\data"
    os.makedirs(output_dir, exist_ok=True)
    
    # Save products (paginated)
    with open(f"{output_dir}/products_page_1.json", "w") as f:
        json.dump(products[:1000], f)
    
    with open(f"{output_dir}/products_page_2.json", "w") as f:
        json.dump(products[1000:2000], f)
    
    with open(f"{output_dir}/products_page_3.json", "w") as f:
        json.dump(products[2000:3000], f)
    
    with open(f"{output_dir}/products_page_4.json", "w") as f:
        json.dump(products[3000:4000], f)
    
    with open(f"{output_dir}/products_page_5.json", "w") as f:
        json.dump(products[4000:5000], f)
    
    # Save index
    with open(f"{output_dir}/products_index.json", "w") as f:
        json.dump({
            "total": len(products),
            "index": search_index
        }, f)
    
    print(f"✅ Exported {len(products)} products")
    print(f"✅ Files saved to: {output_dir}")
    print(f"\nFiles created:")
    print(f"  - products_page_1.json (0-1000)")
    print(f"  - products_page_2.json (1000-2000)")
    print(f"  - products_page_3.json (2000-3000)")
    print(f"  - products_page_4.json (3000-4000)")
    print(f"  - products_page_5.json (4000-5000)")
    print(f"  - products_index.json (search index)")
    
    conn.close()
    return products

if __name__ == "__main__":
    export_products_sample()
