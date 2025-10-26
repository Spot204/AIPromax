from pathlib import Path
from transformers import BertTokenizer, BertForSequenceClassification

def connect_model():
    # ✅ Tạo đường dẫn tuyệt đối đến thư mục chứa model (tránh lỗi './')
    model_dir = Path(__file__).resolve().parent / "bert_url_model"

    # ✅ Load local model và tokenizer
    tokenizer = BertTokenizer.from_pretrained(str(model_dir), local_files_only=True)
    model = BertForSequenceClassification.from_pretrained(str(model_dir), local_files_only=True)

    model.eval()
    print("✅ Mô hình và Tokenizer đã được tải thành công từ:", model_dir)
    return model, tokenizer
