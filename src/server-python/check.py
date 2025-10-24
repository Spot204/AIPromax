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
            "AI nhận thấy các đặc trưng trong URL này tương đồng với trang hợp pháp, "
            "không chứa dấu hiệu lừa đảo hoặc phát tán mã độc. Mức độ an toàn cao."
        )
    elif mal_w <= 0.5:
        opinion = "Nghi ngờ nhẹ"
        description = (
            "URL có một số yếu tố hơi bất thường (ví dụ: tên miền phụ, đường dẫn dài, "
            "hoặc chứa ký tự lạ), nhưng chưa đủ mạnh để kết luận độc hại. "
            "Khuyến nghị kiểm tra thủ công hoặc tránh nhập thông tin nhạy cảm."
        )
    elif mal_w <= 0.8:
        opinion = "Nguy cơ cao"
        description = (
            "AI phát hiện nhiều tín hiệu đáng ngờ: có thể giả mạo dịch vụ uy tín, "
            "chứa từ khóa nhạy cảm (login, verify, update), hoặc tệp thực thi. "
            "Không nên truy cập nếu không chắc chắn."
        )
    else:
        opinion = "Rất độc hại"
        description = (
            "Mô hình xác định đây là URL có xác suất cao chứa nội dung độc hại — "
            "có thể dẫn đến phần mềm độc hại, lừa đảo hoặc xâm nhập dữ liệu. "
            "Tuyệt đối không mở hoặc chia sẻ đường dẫn này."
        )

    return opinion, description, float(mal_w)