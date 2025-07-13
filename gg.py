#!/usr/bin/env python3
"""
keep_first_5_csv.py
Keeps only the first 5 rows (header + 4 data rows) of the CSV file
'yahoo_images_20250712_200523.csv' and overwrites it.
"""

import csv
from pathlib import Path

def clean(path):
    csv_file = Path(path)
    with csv_file.open(newline='', encoding='utf-8') as f:
        rows = [row for _, row in zip(range(2), csv.reader(f))]

    with csv_file.open('w', newline='', encoding='utf-8') as f:
        csv.writer(f).writerows(rows)

    print(f"Kept only the first 5 rows in {csv_file}")