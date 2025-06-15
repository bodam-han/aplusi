from flask import Flask, request, jsonify, render_template
from flask_cors import CORS, cross_origin
from model import load_data, find_similar_tools

# Explicitly define static_url_path and static_folder for serving static files
app = Flask(__name__, static_url_path='/static', static_folder='static')
CORS(app, resources={r"/*": {"origins": ["*"]}}, supports_credentials=True)

# 데이터 로드
data = load_data()

@app.route("/recommend", methods=["POST", "OPTIONS"])
def recommend():
    if request.method == "OPTIONS":
        return '', 200
    try:
        user_input = request.get_json()

        category = user_input.get("purpose")
        difficulty = int(user_input.get("difficulty"))
        quality = int(user_input.get("quality"))
        customization = int(user_input.get("customization"))
        target_user = user_input.get("target_user")

        # target_user 필터링 먼저 적용
        filtered_data = data[data["target_user"] == target_user]

        # 추천 수행
        recommended = find_similar_tools(filtered_data, category, difficulty, quality, customization)
        print("추천 개수:", len(recommended))
        try:
            print("추천 결과 1개:", recommended[0], type(recommended[0]))
        except Exception as e:
            print("추천 결과 출력 실패:", e)

        def extract_scalar(val, default=""):
            try:
                if hasattr(val, "item"):
                    return val.item()
                elif hasattr(val, "values"):
                    return val.values[0]
                else:
                    return val
            except:
                return default

        # 각 추천 결과를 딕셔너리 형태로 변환 (예시적으로 가공)
        response = []
        for tool in recommended:
            if isinstance(tool, dict):
                get = tool.get
            elif isinstance(tool, str):
                try:
                    import json
                    tool = json.loads(tool)
                    get = tool.get
                except:
                    get = lambda k, d=None: None
            elif hasattr(tool, "get"):
                get = tool.get
            elif hasattr(tool, "__getitem__"):
                get = tool.__getitem__
            else:
                get = lambda k, d=None: None

            tool_name = extract_scalar(get("tool_name"), "이름 없음")
            if not isinstance(tool_name, str):
                try:
                    tool_name = str(tool_name)
                except:
                    tool_name = "이름 없음"

            if isinstance(tool_name, str):
                if not tool_name or tool_name.strip().lower() in ["nan", "none"]:
                    tool_name = "이름 없음"
            else:
                tool_name = "이름 없음"
            sim = extract_scalar(get("similarity"), 0)
            url = extract_scalar(get("url"), "#")
            image_filename = extract_scalar(get("image_url"), "default.png")
            image_url = image_filename

            try:
                similarity = float(sim)
            except:
                similarity = 0.0

            response.append({
                "tool_name": tool_name,
                "similarity": similarity,
                "url": url,
                "image_url": image_url
            })

        return jsonify(response)
    except Exception as e:
        import traceback
        print("서버 처리 중 에러 발생:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/auth/status", methods=["GET", "OPTIONS"])
@cross_origin(origins=["https://aplusi.onrender.com", "http://127.0.0.1:5500"], supports_credentials=True)
def auth_status():
    if request.method == "OPTIONS":
        return '', 200
    return jsonify({"isAdmin": False})


@app.route("/aisearch")
def show_search():
    return render_template("aisearch.html")

@app.route("/notice")
def notice():
    return render_template("notice.html")

# notice_1.html route
@app.route("/notice_1")
def notice_1():
    return render_template("fixed_notice_1.html")


# CORS headers for all responses
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin') or '*')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

import os

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=True)
