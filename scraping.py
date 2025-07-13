import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
import time
import csv
from datetime import datetime


import pandas as pd
import image_scrape as img_scrape
import gg as g
import ass as Ass



def get_yahoo_image_hrefs(search_url, max_results=5):
    """Extract hrefs from Yahoo image links with both classes (limited to max_results)"""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
    }

    try:
        response = requests.get(search_url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        image_links = [a for a in soup.find_all('a')
                      if all(cls in a.get('class', [])
                            for cls in ['redesign-img', 'round-img'])]

        base_domain = "https://" + urlparse(search_url).netloc
        # Return only the first max_results links
        return [urljoin(base_domain, link.get('href')) for link in image_links[:max_results] if link.get('href')]

    except Exception as e:
        print(f"Error: {e}")
        return []

def extract_img_components(href):
    """Extract all img components from a Yahoo image detail page"""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Referer": "https://images.search.yahoo.com/"
    }

    try:
        response = requests.get(href, headers=headers, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        images = []
        for img in soup.find_all('img'):
            src = img.get('src', '')
            if src.startswith('data:'):
                src = ''  # Skip data URIs

            images.append({
                'page_url': href,
                'src': src,
                'data_src': img.get('data-src', ''),
                'alt': img.get('alt', '')[:200],
                'width': img.get('width', ''),
                'height': img.get('height', ''),
                'classes': '|'.join(img.get('class', [])),
                'id': img.get('id', '')
            })

        return images

    except Exception as e:
        print(f"Error processing {href[:50]}...: {e}")
        return []

def save_to_csv(data, filename):
    """Save extracted image data to CSV"""
    if not data:
        print("No data to save")
        return

    keys = data[0].keys()
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(data)
    print(f"Data saved to {filename}")

def start_scraping(search_url, timestamp, csv_filename, max_results=1):
    print("Starting Yahoo image extraction...")

    # Step 1: Get first 5 hrefs with both classes
    hrefs = get_yahoo_image_hrefs(search_url, max_results)
    print(f"Found {len(hrefs)} image detail pages (limited to first {max_results})")

    # Step 2: Process each href to extract img components
    all_images = []
    for i, href in enumerate(hrefs, 1):
        print(f"\rProcessing page {i}/{len(hrefs)} - {href[:60]}...", end="")
        images = extract_img_components(href)
        all_images.extend(images)
        time.sleep(0.5)  # Be polite

    # Step 3: Save to CSV
    if all_images:
        ##save_to_csv(all_images, csv_filename)
        return all_images
        print(f"\n\nExtraction complete! Saved {len(all_images)} images to {csv_filename}")
    else:
        print("\nNo images found to save")

def scraper(query):
    search_url = f"https://images.search.yahoo.com/search/images?p={query}&imgty=photo"
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_filename = f"yahoo_images{timestamp}.csv"
    image = start_scraping(search_url, timestamp, csv_filename, max_results=2)
    return [csv_filename, image[0]]
# Example usage:




if __name__ == "__main__":

    dataframe = pd.read_csv("farmers_markets.csv");

    market_names = dataframe['market_name'];
    csv_filename = "";
    for market in market_names:
        print(market)
        csv_filename, image = scraper(market)
        img_link = img_scrape.scrape_yahoo_original_image_link(image['page_url'])
        with open("img_link_row.csv", 'a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(new_row)
        ##g.clean(csv_filename)
        ##pd.read_csv(csv_filename)



    ##csv_filename = scraper("farmers market")
    ##g.clean(csv_filename);
    ##df = pd.read_csv(csv_filename);
    ##img_links = df['page_url'].values.tolist()


    ##print(img_links);









