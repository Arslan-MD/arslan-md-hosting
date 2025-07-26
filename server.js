// deploy.js
import axios from "axios";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());

const RENDER_API_KEY = process.env.RENDER_API_KEY;
const OWNER_ID = process.env.RENDER_OWNER_ID || "user-xxxxxxxx"; // Replace with your default

app.post("/deploy", async (req, res) => {
  const { username, session_id } = req.body;

  if (!username || !session_id) {
    return res.status(400).json({ error: "Missing username or session_id" });
  }

  const repo = `${username}/arslan-md-hosting`;

  try {
    const response = await axios.post(
      "https://api.render.com/v1/services",
      {
        service: {
          name: `arslan-bot-${username}`,
          type: "web",
          repo: {
            repoId: repo,
            repoBranch: "main",
            autoDeploy: true,
            buildCommand: "npm install",
            startCommand: "npm start"
          },
          env: "node",
          envVars: [
            {
              key: "SESSION_ID",
              value: session_id
            }
          ],
          region: "oregon",
          plan: "starter"
        },
        ownerId: OWNER_ID
      },
      {
        headers: {
          Authorization: `Bearer ${RENDER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.json({
      success: true,
      message: "✅ Bot is deploying on Render!",
      render_service: response.data.service,
    });
  } catch (err) {
    console.error("❌ Deployment error:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Failed to deploy bot",
      detail: err.response?.data || err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Render Deploy Server running on port ${PORT}`);
});
