import torch
import torch.nn.functional as F

def predict_url_with_temperature(tokenizer, model, url_text, temperature=5.0):
    # Bước 1: Mã hóa URL
    inputs = tokenizer(url_text, return_tensors="pt", padding=True, truncation=True)

    # Bước 2: Dự đoán bằng mô hình
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits.squeeze() / temperature  # Làm mềm xác suất
    probs = F.softmax(logits, dim=0).cpu().numpy()

    # Bước 3: Lấy xác suất của hai lớp
    benign_w, mal_w = probs[0], probs[1]

    # Bước 4: Xác định mức độ (opinion)
    if mal_w <= 0.3:
        opinion = "Bình thường"
        description = (
            "URL trông hợp pháp, không có dấu hiệu lừa đảo hay mã độc. An toàn để truy cập."
        )
    elif mal_w <= 0.5:
        opinion = "Nghi ngờ nhẹ"
        description = (
            "Có vài yếu tố bất thường như tên miền phụ hoặc ký tự lạ. Nên kiểm tra kỹ trước khi nhập thông tin."
        )
    elif mal_w <= 0.8:
        opinion = "Nguy cơ cao"
        description = (
            "URL có dấu hiệu giả mạo hoặc chứa nội dung nguy hiểm. Không nên truy cập nếu không chắc chắn."
        )
    else:
        opinion = "Rất độc hại"
        description = (
            "Đường dẫn có khả năng chứa mã độc hoặc lừa đảo. Tuyệt đối không mở hoặc chia sẻ."
        )

    return opinion, description, float(mal_w)

