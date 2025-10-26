import requests
from bs4 import BeautifulSoup

def fetch_data(phone_number):
    url = f"https://trasdt.org/sdt/{phone_number}"
    response = requests.get(url)

    # Check if the response is 404 (not found)
    if response.status_code == 404:
        return {
            "phone": phone_number,
            "opinion": "An toàn",  # Default value when not found
            "description": "Chưa có báo cáo"  # Default value when not found
        }

    # Parse the HTML content if status is not 404
    soup = BeautifulSoup(response.text, 'html.parser')

    try:
        # Extract the phone number from the <h2> tag
        phone = soup.find('h2', class_='p-3 tiitle_name').find_all('span')[1].text.strip()

        # Extract opinion (from the 'review-opinion' class)
        opinion = soup.find('span', {'class': 'review-opinion'}).text.strip()

        # Extract description (from the 'card-description' class)
        description = soup.find('div', {'class': 'card-description'}).p.text.strip()

        # Return results
        return {
            "phone": phone,
            "opinion": opinion,
            "description": description
        }
    except Exception as e:
        # If scraping fails, return default values
        return {
            "phone": phone_number,
            "opinion": "An toàn",  # Default value in case of error
            "description": "Chưa có báo cáo về số điện thoại này"  # Default value in case of error
        }