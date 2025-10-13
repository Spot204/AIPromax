import requests
from bs4 import BeautifulSoup

url = "https://trasdt.org/?page=2"  # hoặc trang cụ thể, ví dụ "https://trasdt.org/sdt/0923360301"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

resp = requests.get(url, headers=headers)
soup = BeautifulSoup(resp.text, "html.parser")

results = []

for card in soup.select("div.card.card-comment-item"):
    phone = card.select_one(".card-title.sdt-info a")
    opinion = card.select_one(".review-opinion span")
    desc = card.select_one(".card-description p")

    results.append({
        "phone": phone.get_text(strip=True) if phone else "",
        "opinion": opinion.get_text(strip=True) if opinion else "",
        "description": desc.get_text(strip=True) if desc else ""
    })

for r in results:
    print(r)
