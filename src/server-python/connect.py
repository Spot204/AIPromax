from transformers import BertTokenizerFast, BertForSequenceClassification

def connect_model():
    # 🌟 Dùng đường dẫn lưu trữ chính xác từ Google Drive
    MODEL_PATH = "./bert_url_model"

    # Tải mô hình
    # Thư viện sẽ tìm các file như config.json và pytorch_model.bin trong thư mục này
    model = BertForSequenceClassification.from_pretrained(MODEL_PATH)

    # Tải tokenizer
    # Thư viện sẽ tìm các file như vocab.txt, tokenizer_config.json, added_tokens.json, v.v.
    tokenizer = BertTokenizerFast.from_pretrained(MODEL_PATH)

    model.eval() # Chuyển sang chế độ suy luận
    print("Mô hình và Tokenizer đã được tải thành công!")
    return model, tokenizer
