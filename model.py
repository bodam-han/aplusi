# model.py
import pandas as pd

# 예제 데이터 불러오기 (CSV)
def load_data():
    data = pd.read_csv('ai_tools.csv')  # CSV 파일명
    data = data.dropna()
    return data


# 조건에 따라 유사도 점수를 계산하는 함수
def calculate_similarity(row, category, difficulty, quality, customization):
    score = 0
    if row['category'] == category:
        score += 3  # 유형 일치 시 가중치
    score -= abs(row['difficulty'] - difficulty)
    score -= abs(row['quality'] - quality)
    score -= abs(row['customization'] - customization)
    return score

# 조건에 맞는 tool_name을 유사도 순으로 정렬해서 출력
def find_similar_tools(data, category, difficulty, quality, customization):
    data = data.copy()
    data['similarity'] = data.apply(
        lambda row: calculate_similarity(row, category, difficulty, quality, customization), axis=1
    )
    # 유사도 점수 기준으로 내림차순 정렬
    ranked_tools = data.sort_values(by='similarity', ascending=False)
    # 중복된 tool_name 제거 후 상위 3개 선택
    ranked_tools = ranked_tools.drop_duplicates(subset=['tool_name'])
    tools = ranked_tools[['tool_name', 'similarity', 'url', 'image_url']].head(3).fillna("")
    return [
        {
            "tool_name": row["tool_name"],
            "similarity": str(idx + 1),
            "url": row["url"],
            "image_url": f"/static/tool_icons/search/{row['image_url'].replace(' ', '_')}"
        }
        for idx, (_, row) in enumerate(tools.iterrows())
    ]

# 메인 실행
if __name__ == "__main__":
    data = load_data()
    
    # 사용자 입력 (예시)
    input_category = '텍스트'
    input_difficulty = 1
    input_quality = 2
    input_customization = 1

    # 조건 기반 유사도 순 추천
    similar_tools = find_similar_tools(
        data,
        input_category,
        input_difficulty,
        input_quality,
        input_customization
    )
    
    print("유사도 기반 추천 AI 도구 목록 (유사도 높은 순):")
    print(similar_tools)