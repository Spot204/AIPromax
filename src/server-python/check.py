import torch
import torch.nn.functional as F

def predict_url_with_temperature(tokenizer, model,url_text, temperature=5.0):  # thử T=2.0–5.0
    # Bước 1: Mã hóa URL
    inputs = tokenizer(url_text, return_tensors="pt", padding=True, truncation=True)

    # Bước 2: Dự đoán bằng mô hình
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits.squeeze() / temperature  # ⚠️ Làm mềm xác suất bằng temperature
    probs = F.softmax(logits, dim=0).cpu().numpy()

    # Bước 3: Lấy xác suất của hai lớp
    benign_w, mal_w = probs[0], probs[1]

    # Bước 4: In ra kết quả
    print(f"\n URL: {url_text}")
    print(f" Trọng số hiệu chỉnh (T={temperature}): [Benign={benign_w:.6f}, Malicious={mal_w:.6f}]")

    # Phân cấp mức độ
    if mal_w <= 0.3:
        level = " Bình thường"
    elif mal_w <= 0.5:
        level = " Nghi ngờ nhẹ"
    elif mal_w <= 0.8:
        level = " Nguy cơ cao"
    else:
        level = " Rất độc hại"

    print(f" Mức độ: {level}")
    return level
