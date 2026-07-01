#!/usr/bin/env python3
"""
Generate products.ts file from SQLite database
This creates a TypeScript file that's part of the build
"""

import sqlite3
import json
import os

def generate_products_ts():
    """Generate products.ts with all products embedded"""
    db_path = "C:\\Jeevanreport2.0\\products.db"
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get ALL products (not just 5000)
    print("Fetching ALL products from database...")
    cursor.execute("""
        SELECT id, barcode, name, brand, category, 
               trust_score, trust_level, data 
        FROM products 
        ORDER BY trust_score DESC, name ASC
    """)
    
    products = []
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
                "trust_level": row[6] or "unknown",
                "data": product_data
            }
            
            products.append(product)
        except Exception as e:
            print(f"Error processing product {row[0]}: {e}")
            continue
    
    conn.close()
    
    print(f"Total products: {len(products)}")
    
    # Generate TypeScript file
    output_file = "C:\\Jeevanreport2.0\\src\\lib\\products-embedded.ts"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("// AUTO-GENERATED FILE - All products embedded for deployment\n")
        f.write("// Generated at build time from SQLite database\n\n")
        f.write("import type { Product } from './types';\n\n")
        
        # Write products array in chunks to avoid file size issues
        f.write("const allProducts: Product[] = ")
        
        # Write JSON directly
        json.dump(products, f, default=str, indent=2)
        
        f.write(";\n\n")
        f.write("export function getEmbeddedProducts(): Product[] {\n")
        f.write("  return allProducts;\n")
        f.write("}\n\n")
        f.write("export function getEmbeddedProductByBarcode(barcode: string): Product | null {\n")
        f.write("  const clean = barcode.replace(/\\D/g, '');\n")
        f.write("  return allProducts.find((p) => p.barcode === clean) || null;\n")
        f.write("}\n\n")
        f.write("export function searchEmbeddedProducts(query: string, limit = 20): Product[] {\n")
        f.write("  const q = query.toLowerCase();\n")
        f.write("  return allProducts\n")
        f.write("    .filter((p) => \n")
        f.write("      p.name.toLowerCase().includes(q) || \n")
        f.write("      p.brand.toLowerCase().includes(q) || \n")
        f.write("      p.barcode.includes(q)\n")
        f.write("    )\n")
        f.write("    .slice(0, limit);\n")
        f.write("}\n")
    
    file_size = os.path.getsize(output_file) / (1024 * 1024)
    print(f"✅ Generated {output_file}")
    print(f"   File size: {file_size:.1f} MB")
    print(f"   Products: {len(products):,}")

if __name__ == "__main__":
    generate_products_ts()
