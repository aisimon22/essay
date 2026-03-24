// netlify/functions/gemini.js

exports.handler = async function(event, context) {
  // 只允許 POST 請求
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // 從 Netlify 環境變數讀取你的 API Key
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "伺服器未設定 API Key" })
    };
  }

  // Gemini API 的完整網址
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    // 將前端傳來的資料 (event.body) 轉發給 Google Gemini
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event.body 
    });

    const data = await response.json();

    // 如果 Google 回傳錯誤，直接將錯誤拋給前端
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify(data)
      };
    }

    // 成功！將 Gemini 的回覆傳給前端
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error("Fetch error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "無法連線至 Gemini API" })
    };
  }
};