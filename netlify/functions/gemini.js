// netlify/functions/gemini.js

exports.handler = async function(event, context) {
  // 1. 只允許 POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // 2. 檢查環境變數
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "伺服器未設定 GEMINI_API_KEY" })
    };
  }

  // 3. 修正模型名稱 (建議使用 1.5-flash，速度快且穩定)
  const MODEL_NAME = "gemini-2.5-flash-preview-09-2025"; 
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

  try {
    // 4. 轉發請求
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: event.body 
    });

    const data = await response.json();

    // 5. 處理 Google 回傳的錯誤
    if (!response.ok) {
      console.error("Google API Error Response:", data);
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Google API 呼叫失敗",
          status: response.status,
          message: data.error?.message || "未知錯誤",
          details: data // 這樣你在 F12 就能看到具體原因
        })
      };
    }

    // 6. 成功回傳
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error("Function執行異常:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "伺服器內部錯誤", message: error.message })
    };
  }
};