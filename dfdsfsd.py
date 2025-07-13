import csv
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
import time
import google.generativeai as genai
import scraping as scrape
import pandas as pd




CSV_FILE = "farmers_markets.csv"
HEADERS = [
    "state_name", "state_abbreviation", "county_name",
    "market_name", "market_description", "market_address",
    "market_city", "market_zipcode", "market_latitude",
    "market_longitude", "market_open_days", "market_open_time",
    "market_close_time", "market_website", "market_phone", "market_email"
]  # Removed image_url column

def init_csv():
    with open(CSV_FILE, mode='a+', newline='', encoding='utf-8') as f:
        if f.tell() == 0:  # File is empty
            writer = csv.writer(f)
            writer.writerow(HEADERS)

def clean_row(row):
    """Ensure each row has exactly 16 columns"""
    if len(row) < 16:
        row += [''] * (16 - len(row))  # Fill missing columns with empty strings
    return row[:16]  # Truncate if too long

def call_ai_for_farmers_market(county):
    # Configure API key
    genai.configure(api_key="AIzaSyDC3QzbikUVWce_tvEkot5FLURkyGVeWd8")

    prompt = f"""
    Return ALL farmers markets in {county} County, California (CA) as RAW CSV DATA with NO ADDITIONAL TEXT.
    Use empty strings for missing data. Include EXACTLY these 16 columns in this order:
    {','.join(HEADERS)}

    Example format:
    California,CA,Sonoma,Santa Rosa Original Farmers Market,"Vintage market since 1978","100 Santa Rosa Ave",Santa Rosa,95404,38.4405,-122.7141,Saturday,08:30:00,13:00:00,http://santarosafarmersmarket.org,707-555-1234,

    Rules:
    1. MUST include header row
    2. Each data row MUST have exactly 16 comma-separated values
    3. Quote fields containing commas
    4. Never use markdown code blocks
    5. Use empty strings for missing data
    """

    try:
        # Use the GenerativeModel class
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)

        if response.text:
            with open(CSV_FILE, mode='a', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                lines = response.text.strip().split('\n')

                # Skip if already processed headers
                skip_header = False
                if open(CSV_FILE, 'r', encoding='utf-8').readline():
                    skip_header = True

                for i, line in enumerate(lines):
                    if skip_header and i == 0:
                        continue  # Skip header row in AI response

                    # Parse and clean the row
                    row = list(csv.reader([line]))[0]
                    row = clean_row(row)
                    writer.writerow(row)

    except Exception as e:
        print(f"Error processing {county}: {str(e)}")

# Initialize and run
init_csv()
northern_california_counties = ["Sonoma", "Napa", "Marin", "San Francisco"]
for county in northern_california_counties:
    call_ai_for_farmers_market(county)




data = pd.read_csv("farmers.csv");
markets = data["market_name"]