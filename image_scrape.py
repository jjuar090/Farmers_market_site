import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs, unquote
import sys

def scrape_yahoo_original_image_link(url):
    """
    Scrapes a Yahoo image detail page to find and print the original image URL
    embedded in the 'imgurl' query parameter.
    """
    print(f"Processing Yahoo image detail page for link extraction: {url}\n")
    try:
        # Parse the URL to extract query parameters
        parsed_url = urlparse(url)
        query_params = parse_qs(parsed_url.query)

        # Get the 'imgurl' parameter, which contains the link to the original image
        original_image_url_encoded = query_params.get('imgurl', [None])[0]

        if original_image_url_encoded:
            # URL-decode the original image URL
            original_image_url = unquote(original_image_url_encoded)
            ###print(f"Found **original, high-quality image link**: {original_image_url}")
        else:
            print("Could not find 'imgurl' parameter in the Yahoo image detail URL. "
                  "This means the direct link to the high-quality image isn't readily available here.")

        # Optionally, you can still scrape for <img> tags on the page,
        # but these are often lower quality previews or thumbnails.
        # If you explicitly want these too, uncomment the following block:
        #
        # response = requests.get(url, timeout=10)
        # response.raise_for_status()
        # soup = BeautifulSoup(response.text, 'html.parser')
        # img_tags = soup.find_all('img')
        #
        # if img_tags:
        #     print("\nFound other <img> tags on this detail page (likely thumbnails/previews):")
        #     for img in img_tags:
        #         src = img.get('src')
        #         if src:
        #             if src.startswith('//'):
        #                 print(f"  https:{src}")
        #             elif src.startswith('/'):
        #                 base_url = parsed_url.scheme + "://" + parsed_url.netloc
        #                 print(f"  {base_url}{src}")
        #             else:
        #                 print(f"  {src}")
        # else:
        #     print("No other <img> tags found on this specific Yahoo image detail HTML.")
        return original_image_url_encoded
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while fetching the URL: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
