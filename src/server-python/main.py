from flask_cors import CORS
from flask import Flask, jsonify, request
from connect import connect_model
from check import predict_url_with_temperature
from checksdt import fetch_data

app = Flask(__name__)
CORS(app)

model, tokenizer = connect_model()

@app.route('/api/checklink', methods=['POST'])
def check_link():
    try:
        data = request.get_json()
        url = data.get('data')  # dùng .get để tránh lỗi nếu 'url' không tồn tại
        opinion, description, mal_w = predict_url_with_temperature(tokenizer, model, url, temperature=4.5)
        return jsonify({'opinion': opinion,
                        'description':description,
                         'mal_w' : float(mal_w)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/lookup/<phone_number>', methods=['GET'])
def lookup(phone_number):
    try:
        data = fetch_data(phone_number)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": f"Error fetching data: {str(e)}"}), 500

if __name__=='__main__':
    app.run(port=5000, debug=True)