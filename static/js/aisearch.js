function handleAISubmit(e) {
  e.preventDefault();

  const form = document.getElementById("ai-form");
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  fetch("https://aplusai.onrender.com/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      console.debug("Raw fetch response:", res);
      if (!res.ok) {
        const text = await res.text();
        throw new Error("서버 응답 오류: " + res.status + " " + text);
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error("JSON 응답이 아님: " + text);
      }
      return res.json();
    })
    .then((result) => {
      console.log("서버 응답 결과:", result);
      const cardIds = ["card-1", "card-2", "card-3"];
      cardIds.forEach(id => {
        const card = document.getElementById(id);
        if (card) {
          card.style.display = "block";
        }
      });
      document.getElementById("placeholder-text").style.display = "none";
      document.getElementById("result-header").style.display = "block";
      const resultHeader = document.getElementById("result-header");
      resultHeader.textContent = "추천 AI";
      resultHeader.style.backgroundColor = "#d35c5c";
      resultHeader.style.color = "#fff";
      resultHeader.style.borderRadius = "6px";
      resultHeader.style.cursor = "pointer";
      resultHeader.style.width = "fit-content";
      resultHeader.style.margin = "0 auto 20px";
      resultHeader.style.padding = "10px 20px";
      resultHeader.style.fontSize = "16px";

      result.forEach((tool, index) => {
        if (index < 3 && tool) {
          document.getElementById(`tool-name-${index + 1}`).textContent = tool.tool_name || "이름 없음";
          document.getElementById(`similarity-${index + 1}`).textContent =
            tool.similarity ? `추천 순위: ${tool.similarity}위` : "추천 순위: 정보 없음";
          document.getElementById(`link-${index + 1}`).href = tool.url || "#";
          document.getElementById(`image-${index + 1}`).src = tool.image_url ? tool.image_url : "https://via.placeholder.com/100";
        }
      });
    })
    .catch((err) => console.error("에러:", err));
}

window.handleAISubmit = handleAISubmit;