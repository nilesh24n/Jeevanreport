#!/usr/bin/env python3
"""
Analyze products to identify categories and filter for consumable items only
"""

import sqlite3
import json
from collections import defaultdict

db_path = "C:\\Jeevanreport2.0\\products.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get unique categories
cursor.execute("SELECT DISTINCT category FROM products WHERE category IS NOT NULL")
categories = cursor.fetchall()

print("=== PRODUCT CATEGORIES ===\n")
category_counts = defaultdict(int)

for (category,) in categories:
    cursor.execute("SELECT COUNT(*) FROM products WHERE category = ?", (category,))
    count = cursor.fetchone()[0]
    category_counts[category] = count
    print(f"{category}: {count} products")

# Identify non-consumable categories
non_consumable_keywords = [
    'soap', 'shampoo', 'conditioner', 'lotion', 'cream', 'makeup', 'cosmetic',
    'personal care', 'cleaning', 'detergent', 'bleach', 'deodorant',
    'toothbrush', 'dental care', 'hair care', 'body care', 'bath'
]

print("\n=== NON-CONSUMABLE CATEGORIES ===\n")
non_consumable = []
for cat in category_counts:
    if cat and any(keyword.lower() in cat.lower() for keyword in non_consumable_keywords):
        print(f"❌ {cat}: {category_counts[cat]} products")
        non_consumable.append(cat)

print(f"\n=== SUMMARY ===")
total = sum(category_counts.values())
non_consumable_count = sum(category_counts[cat] for cat in non_consumable)
consumable_count = total - non_consumable_count

print(f"Total products: {total}")
print(f"Non-consumable to remove: {non_consumable_count}")
print(f"Consumable products remaining: {consumable_count}")

conn.close()
