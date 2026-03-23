const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // 只允許 POST 請求，增加安全性
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: "Method Not Allowed" }) 
    };
  }

  // 從 Netlify 後台設定的環境變數讀取 Key (不會出現在程式碼中)
  const API_KEY = process.env.GEMINI_API_KEY;
  const MODEL = "gemini-2.5-flash-preview-09-2025";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  try {
    const payload = JSON.parse(event.body);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        // 允許跨網域請求 (如果需要從不同地方呼叫)
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "伺服器代理發生錯誤: " + error.message })
    };
  }
};