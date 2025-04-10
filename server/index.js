const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  "https://proud-water-0c6f1f403.6.azurestaticapps.net"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(bodyParser.json());

app.post("/assess", async (req, res) => {
  const { profile, answers } = req.body;

  const prompt = `
You are an expert consultant in digital transformation and business assessment.

Based on the following company profile and answers, provide:
1. A short summary of the company’s digital maturity.
2. Key strengths and weaknesses.
3. Three tailored recommendations to improve.
4. A projected ROI if recommendations are implemented.

Company Profile:
${JSON.stringify(profile, null, 2)}

Assessment Answers:
${JSON.stringify(answers, null, 2)}
`;

  try {
    const response = await axios.post(
      `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-02-15-preview`,
      {
        messages: [
          { role: "system", content: "You are a digital transformation consultant." },
          { role: "user", content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.7
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.AZURE_OPENAI_API_KEY
        }
      }
    );

    const message = response.data.choices[0].message.content;
    res.json({ summary: message });
  } catch (error) {
    console.error("Azure OpenAI error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get AI response." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
