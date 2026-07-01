#!/usr/bin/env python3
"""
Export products in smaller chunks for optimal build size
"""

import sqlite3
import json
import os

def export_chunked_products():
    """Export products in 50MB chunks"""
    db_path = "C:\\Jeevanreport2.0\\products.db"
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Count total
    cursor.execute("SELECT COUNT(*) FROM products")
    total = cursor.fetchone()[0]
    print(f"Total products in database: {total:,}")
    
    # Chunk size to aim for ~10MB per file
    chunk_size = 10000
    output_dir = "C:\\Jeevanreport2.0\\src\\lib\\data"
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate chunk files
    chunk_num = 0
    offset = 0
    
    while offset < total:
        chunk_num += 1
        print(f"\nProcessing chunk {chunk_num}...")
        
        cursor.execute("""
            SELECT id, barcode, name, brand, category, 
                   trust_score, trust_level, data 
            FROM products 
            ORDER BY trust_score DESC, name ASC
            LIMIT ? OFFSET ?
        """, (chunk_size, offset))
        
        chunk_products = []
        for row in cursor.fetchall():
            try:
                product_data = json.loads(row[7]) if row[7] else {}
                product = {
                    "id": row[0],
                    "barcode": row[1],
                    "name": row[2],
                    "brand": row[3],
                    "category": row[4],
                    "trust_score": row[5] or 0,
                    "trust_level": row[6],
                    "data": product_data
                }
                chunk_products.append(product)
            except Exception as e:
                pass
        
        # Save chunk
        chunk_file = os.path.join(output_dir, f"products_chunk_{chunk_num}.json")
        with open(chunk_file, 'w', encoding='utf-8') as f:
            json.dump(chunk_products, f, default=str)
        
        file_size = os.path.getsize(chunk_file) / (1024 * 1024)
        print(f"  Chunk {chunk_num}: {len(chunk_products):,} products ({file_size:.1f} MB)")
        
        offset += chunk_size
    
    conn.close()
    
    # Create index file
    print(f"\n✅ Created {chunk_num} product chunks")
    print(f"   Total: {total:,} products")
    print(f"   Files saved to: {output_dir}")
    
    # Create metadata file
    metadata = {
        "total_products": total,
        "chunks": chunk_num,
        "chunk_size": chunk_size,
        "generated_at": "2026-07-01"
    }
    
    metadata_file = os.path.join(output_dir, "metadata.json")
    with open(metadata_file, 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"   Metadata: {metadata_file}")

if __name__ == "__main__":
    export_chunked_products()
